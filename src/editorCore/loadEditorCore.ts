import successFixture from '../../tests/fixtures/editor-core/editor-core-manifest.json'
import failureFixture from '../../tests/fixtures/editor-core/load-failure.json'

export type EditorCoreManifest = {
  name: string
  version: string
  runtime_target: string
  module: string
  binary: string
  capabilities?: string[]
  renderer_boundary?: string
}

export type EditorCoreReady = {
  status: 'ready'
  version: string
  capabilities: string[]
  renderer_boundary: string
}

export type EditorCoreLoadError = {
  status: 'error'
  code: string
  message: string
  recoverable: boolean
}

export type EditorCoreLoad = EditorCoreReady | EditorCoreLoadError

const DEFAULT_CAPABILITIES = ['status']
const DEFAULT_BOUNDARY = 'external'

function isManifest(value: unknown): value is EditorCoreManifest {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    typeof record.name === 'string' &&
    typeof record.version === 'string' &&
    typeof record.runtime_target === 'string' &&
    typeof record.module === 'string' &&
    typeof record.binary === 'string'
  )
}

export function normalizeLoadError(error: unknown): EditorCoreLoadError {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    const typed = error as { code: string; message: string; recoverable?: boolean }
    return {
      status: 'error',
      code: typed.code,
      message: typed.message,
      recoverable: typed.recoverable ?? false,
    }
  }
  return {
    status: 'error',
    code: failureFixture.code,
    message: failureFixture.message,
    recoverable: failureFixture.recoverable,
  }
}

export async function loadEditorCore(
  manifest: unknown = successFixture,
  loadModule: (modulePath: string) => Promise<{ init_editor_core?: () => Promise<unknown> | unknown }> = (modulePath) =>
    import(/* @vite-ignore */ modulePath),
): Promise<EditorCoreLoad> {
  if (!isManifest(manifest) || manifest.name !== 'editor-core' || manifest.runtime_target !== 'wasm32-unknown-unknown') {
    return normalizeLoadError(failureFixture)
  }

  try {
    const binary = await fetch(manifest.binary)
    if (!binary.ok) {
      return normalizeLoadError(failureFixture)
    }
    const module = await loadModule(manifest.module)
    if (!module.init_editor_core) {
      return normalizeLoadError(failureFixture)
    }
    await module.init_editor_core()
    return {
      status: 'ready',
      version: manifest.version,
      capabilities: manifest.capabilities ?? DEFAULT_CAPABILITIES,
      renderer_boundary: manifest.renderer_boundary ?? DEFAULT_BOUNDARY,
    }
  } catch (error) {
    return normalizeLoadError(error)
  }
}
