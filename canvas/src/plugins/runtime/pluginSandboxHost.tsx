import { validatePluginRuntimeMessage } from './pluginRuntimeMessages.ts'
export function pluginSandboxMarkup(): string { return '<iframe sandbox="allow-scripts"></iframe>' }
export function acceptMessage(message: { type?: string }): boolean { return validatePluginRuntimeMessage(message) }
