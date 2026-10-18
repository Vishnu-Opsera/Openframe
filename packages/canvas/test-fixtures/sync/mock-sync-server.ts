import { WebSocketServer, type RawData } from 'ws'

export async function startMockSyncServer(): Promise<{ url: string; close: () => Promise<void> }> {
  const server = new WebSocketServer({ host: '127.0.0.1', port: 0 })
  await new Promise<void>((resolve) => server.once('listening', () => resolve()))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  server.on('connection', (socket) => {
    socket.on('message', (data: RawData, isBinary: boolean) => {
      if (!isBinary) {
        const text = data.toString()
        const frame = JSON.parse(text) as { type?: string }
        if (frame.type === 'hello' || frame.type === 'ping') {
          socket.send(JSON.stringify({ type: frame.type === 'ping' ? 'pong' : 'ack', updateId: 'hello', ts: 0 }))
        }
        if (frame.type === 'error') {
          socket.send(JSON.stringify({ type: 'error', code: 'protocol_error', message: 'rejected' }))
        }
        return
      }
      for (const client of server.clients) {
        if (client !== socket && client.readyState === client.OPEN) {
          client.send(data, { binary: true })
        }
      }
      socket.send(JSON.stringify({ type: 'ack', updateId: 'frame' }))
    })
  })
  return {
    url: `ws://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  }
}
