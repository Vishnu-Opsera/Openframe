import type { CrdtAdapter } from './crdtAdapter.ts'

export type SyncConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'unauthorized' | 'offline'

export interface SyncClientMetrics {
  name: 'websocket_connect_attempt_total' | 'websocket_reconnect_delay_ms' | 'crdt_update_bytes_sent' | 'crdt_update_bytes_received' | 'crdt_ack_latency_ms'
  value: number
  labels: Record<string, string>
}

export class WebSocketSyncClient {
  state: SyncConnectionState = 'disconnected'
  private socket: WebSocket | null = null
  private disposed = false
  private reconnectAllowed = true
  private attempt = 0
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly options: {
    url: string
    adapter: Pick<CrdtAdapter, 'applyRemoteUpdate'>
    tokenProvider: () => Promise<string>
    random?: () => number
    onState?: (state: SyncConnectionState) => void
    onMetric?: (metric: SyncClientMetrics) => void
    socketFactory?: (url: string) => WebSocket
    online?: () => boolean
  }) {}

  private setState(state: SyncConnectionState): void {
    this.state = state
    this.options.onState?.(state)
  }

  async connect(): Promise<void> {
    if (this.disposed || !this.reconnectAllowed) {
      return
    }
    if (this.options.online && !this.options.online()) {
      this.setState('offline')
      return
    }
    const token = await this.options.tokenProvider()
    if (!token) {
      this.setState('unauthorized')
      this.reconnectAllowed = false
      return
    }
    this.attempt += 1
    this.options.onMetric?.({ name: 'websocket_connect_attempt_total', value: this.attempt, labels: { closeCode: '' } })
    this.setState(this.attempt > 1 ? 'reconnecting' : 'connecting')
    const socket = (this.options.socketFactory ?? ((url) => new WebSocket(url)))(`${this.options.url}?token=${token}`)
    socket.binaryType = 'arraybuffer'
    this.socket = socket
    await new Promise<void>((resolve) => {
      socket.addEventListener('open', () => {
        this.setState('connected')
        socket.send(JSON.stringify({ type: 'hello', clientId: 'openframe', protocolVersion: 1 }))
        resolve()
      })
    })
    socket.addEventListener('message', (event) => {
      if (typeof event.data === 'string') {
        this.handleControlFrame(event.data)
        return
      }
      const bytes = event.data instanceof ArrayBuffer ? new Uint8Array(event.data) : new Uint8Array(event.data as ArrayBuffer)
      this.handleBinaryMessage(bytes)
    })
    socket.addEventListener('close', (event) => {
      this.handleClose(event.code)
    })
  }

  sendUpdate(update: Uint8Array): void {
    this.socket?.send(update)
    this.options.onMetric?.({ name: 'crdt_update_bytes_sent', value: update.byteLength, labels: { closeCode: '' } })
  }

  handleBinaryMessage(update: Uint8Array): void {
    this.options.adapter.applyRemoteUpdate(update, 'remote')
    this.options.onMetric?.({ name: 'crdt_update_bytes_received', value: update.byteLength, labels: { closeCode: '' } })
  }

  handleControlFrame(raw: string): void {
    let parsed: { type?: string }
    try {
      parsed = JSON.parse(raw) as { type?: string }
    } catch {
      this.socket?.close(1002)
      this.setState('disconnected')
      return
    }
    if (parsed.type === 'ping') {
      this.socket?.send(JSON.stringify({ type: 'pong', ts: 0 }))
    }
    if (parsed.type === 'ack') {
      this.options.onMetric?.({ name: 'crdt_ack_latency_ms', value: 0, labels: { closeCode: '' } })
    }
  }

  handleClose(code: number): void {
    if (code === 4403 || code === 4401) {
      this.reconnectAllowed = false
      this.setState('unauthorized')
      return
    }
    if (code === 4408) {
      this.reconnectAllowed = false
      this.setState('disconnected')
      return
    }
    if (!this.disposed && this.reconnectAllowed) {
      this.scheduleReconnect()
    }
  }

  scheduleReconnect(): number {
    const jitter = this.options.random?.() ?? 0
    const delay = Math.min(1000 * 2 ** this.attempt, 8000) + Math.floor(jitter * 250)
    this.options.onMetric?.({ name: 'websocket_reconnect_delay_ms', value: delay, labels: { closeCode: '' } })
    this.setState('reconnecting')
    this.timer = setTimeout(() => {
      void this.connect()
    }, delay)
    return delay
  }

  async resumeWithFreshToken(): Promise<void> {
    this.reconnectAllowed = true
    await this.connect()
  }

  dispose(): void {
    this.disposed = true
    this.reconnectAllowed = false
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.socket?.close()
    this.setState('disconnected')
  }
}
