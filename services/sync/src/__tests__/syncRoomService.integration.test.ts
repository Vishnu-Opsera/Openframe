// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { WebSocket } from 'ws'
import { encodeRoomToken } from '../auth/roomTokenValidator.ts'
import { startSyncServer } from '../server.ts'

describe('sync room server', () => {
  it('serves health, metrics, and relays a binary frame', async () => {
    const server = await startSyncServer()
    const health = await fetch(`http://127.0.0.1:${server.port}/healthz`)
    expect(health.status).toBe(200)
    const token = encodeRoomToken({ fileId: 'test-file', actorId: 'actor-1', permissions: ['edit'], exp: 4_102_444_800, iat: 1, roomId: 'room-1' })
    const frame = new Uint8Array(readFileSync('services/sync/fixtures/crdt/update-frame.bin'))
    const echoed = await new Promise<number>((resolve, reject) => {
      const socket = new WebSocket(`ws://127.0.0.1:${server.port}/v1/sync/rooms/test-file?token=${token}`)
      socket.on('open', () => socket.send(frame))
      socket.on('message', (data) => {
        resolve(Buffer.from(data as Buffer).byteLength)
        socket.close()
      })
      socket.on('error', reject)
    })
    const metrics = await fetch(`http://127.0.0.1:${server.port}/metrics`)
    const text = await metrics.text()
    expect(text).toContain('sync_connected_clients')
    expect(text).toContain('sync_room_count')
    expect(text).toContain('sync_join_denied_total')
    expect(text).toContain('sync_relay_latency_ms')
    expect(echoed).toBeGreaterThan(0)
    await server.close()
  })
})
