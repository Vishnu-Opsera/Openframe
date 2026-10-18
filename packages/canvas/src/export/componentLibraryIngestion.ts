export function ingestComponentLibrary(input: { unsafe?: boolean }): { ok: boolean; code?: string } {
  if (input.unsafe) return { ok: false, code: 'UNSAFE_COMPONENT_LIBRARY_INPUT' }
  return { ok: true }
}
