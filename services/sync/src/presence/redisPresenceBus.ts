type Listener = (channel: string, payload: string) => void

export function createRedisPresenceBus() {
  const listeners = new Map<string, Listener[]>()
  return {
    publish(channel: string, payload: string): void {
      for (const listener of listeners.get(channel) ?? []) {
        listener(channel, payload)
      }
    },
    subscribe(channel: string, listener: Listener): void {
      listeners.set(channel, [...(listeners.get(channel) ?? []), listener])
    },
  }
}
