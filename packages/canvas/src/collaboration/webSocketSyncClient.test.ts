import { describe, expect, it, vi } from 'vitest'
import { WebSocketSyncClient } from './webSocketSyncClient.ts'

class FakeSocket extends EventTarget {
  binaryType = 'arraybuffer'
  sent: Array<string | Uint8Array> = []
  send(data: string | Uint8Array): void {
    this.sent.push(data)
  }
  close(): void {
    this.dispatchEvent(new CloseEvent('close', { code: 4403 }))
  }
}

describe('websocket sync client', () => {
  it('connects, sends updates, handles frames, and stops after 4403', async () => {
    const sockets: FakeSocket[] = []
    const applied: Uint8Array[] = []
    const client = new WebSocketSyncClient({
      url: 'ws://127.0.0.1/room',
      adapter: { applyRemoteUpdate: (update) => { applied.push(update); return { applied: true, conflicts: [], metrics: { operationType: 'remote', updateBytes: update.byteLength, appliedUpdates: 1, rejectedUpdates: 0, durationMs: 0 } } } },
      tokenProvider: async () => 'room-token',
      random: () => 0.2,
      socketFactory: () => {
        const socket = new FakeSocket()
        sockets.push(socket)
        return socket as unknown as WebSocket
      },
    })
    const pending = client.connect()
    const socket = await new Promise<FakeSocket>((resolve) => {
      const timer = setInterval(() => {
        const created = sockets[0]
        if (created) {
          clearInterval(timer)
          resolve(created)
        }
      }, 0)
    })
    socket.dispatchEvent(new Event('open'))
    await pending
    expect(client.state).toBe('connected')
    client.sendUpdate(new Uint8Array([1, 2, 3]))
    client.handleBinaryMessage(new Uint8Array([9]))
    expect(applied[0]?.[0]).toBe(9)
    client.handleControlFrame(JSON.stringify({ type: 'ping' }))
    client.handleControlFrame(JSON.stringify({ type: 'ack', updateId: '1' }))
    vi.useFakeTimers()
    const delay = client.scheduleReconnect()
    expect(delay).toBeGreaterThan(0)
    socket?.close()
    client.handleClose(4403)
    expect(client.state).toBe('unauthorized')
    await client.connect()
    expect(sockets).toHaveLength(1)
    client.dispose()
    expect(client.state).toBe('disconnected')
    vi.useRealTimers()
  })
})
