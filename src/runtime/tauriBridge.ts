import browserRuntime from '../../tests/fixtures/tauri/runtime-info.json'

export type RuntimeInfo = {
  runtime: string
  os: string
  arch: string
  app_version: string
  tauri_major_version: number
}

type TauriInvoke = (command: string) => Promise<RuntimeInfo>

type TauriWindow = Window & {
  __TAURI_INTERNALS__?: {
    invoke?: TauriInvoke
  }
}

function isRuntimeInfo(value: unknown): value is RuntimeInfo {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    typeof record.runtime === 'string' &&
    typeof record.os === 'string' &&
    typeof record.arch === 'string' &&
    typeof record.app_version === 'string' &&
    typeof record.tauri_major_version === 'number'
  )
}

export async function getRuntimeInfo(): Promise<RuntimeInfo> {
  const internals = (window as TauriWindow).__TAURI_INTERNALS__
  if (!internals) {
    if (!isRuntimeInfo(browserRuntime)) {
      throw new Error('Browser runtime fixture is malformed.')
    }
    return browserRuntime
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core')
    const result = await invoke('get_runtime_info')
    if (!isRuntimeInfo(result)) {
      throw new Error('Desktop runtime command returned an unexpected payload.')
    }
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Desktop runtime command failed.'
    throw new Error(message)
  }
}
