export function mockRedisPresenceBus(): { publish: (channel: string, payload: string) => void } {
  return { publish() {} }
}
