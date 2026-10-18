import { createServer, type Server } from 'node:http'
import { WebSocketServer } from 'ws'
import { renderPrometheus } from './observability/metrics.ts'
import { authorizeRoomJoin, relayDurableFrame } from './syncRoomService.ts'

export function startSyncServer(): Promise<{ port: number; close: () => Promise<void> }> {
  const http = createServer((request, response) => {
    if (request.url === '/healthz') {
      response.writeHead(200, { 'content-type': 'text/plain' })
      response.end('ok')
      return
    }
    if (request.url === '/metrics') {
      response.writeHead(200, { 'content-type': 'text/plain' })
      response.end(renderPrometheus())
      return
    }
    response.writeHead(404)
    response.end()
  })
  const sockets = new WebSocketServer({ noServer: true })
  http.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1')
    const match = /^\/v1\/sync\/rooms\/([^/]+)$/.exec(url.pathname)
    const token = url.searchParams.get('token') ?? ''
    const fileId = match?.[1] ?? ''
    const decision = authorizeRoomJoin(token, fileId)
    if (decision.closeCode) {
      socket.write(`HTTP/1.1 ${decision.closeCode} denied\r\n\r\n`)
      socket.destroy()
      return
    }
    sockets.handleUpgrade(request, socket, head, (client) => {
      client.on('message', (data) => {
        const frame = new Uint8Array(Buffer.from(data as Buffer))
        const relay = relayDurableFrame(token, fileId, frame)
        if (relay.closeCode) {
          client.close(relay.closeCode)
          return
        }
        if (relay.relay) {
          client.send(frame)
        }
      })
    })
  })
  return new Promise((resolve) => {
    http.listen(0, '127.0.0.1', () => {
      const address = http.address()
      const port = typeof address === 'object' && address ? address.port : 0
      resolve({ port, close: () => closeServer(http, sockets) })
    })
  })
}

function closeServer(http: Server, sockets: WebSocketServer): Promise<void> {
  sockets.close()
  return new Promise((resolve) => http.close(() => resolve()))
}
