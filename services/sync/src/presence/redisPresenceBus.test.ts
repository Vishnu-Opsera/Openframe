import { describe, expect, it } from 'vitest'
import { createRedisPresenceBus } from './redisPresenceBus.ts'

describe('redis presence bus', () => {
  it('delivers payloads on the file channel', () => {
    const bus = createRedisPresenceBus()
    const seen: string[] = []
    bus.subscribe('presence:file-1', (_channel, payload) => seen.push(payload))
    bus.publish('presence:file-1', '{"clientId":"a"}')
    expect(seen).toEqual(['{"clientId":"a"}'])
  })
})
