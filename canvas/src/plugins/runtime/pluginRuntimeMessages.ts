export function validatePluginRuntimeMessage(message: { type?: string }): boolean { return message.type === 'plugin.ready' }
