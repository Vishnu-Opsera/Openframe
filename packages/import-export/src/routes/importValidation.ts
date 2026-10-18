import { importValidationLog, validateImportPayload, type ImportValidationResult } from '../security/inputValidator.ts'

export function handleImportValidation(bytes: Uint8Array, contentType: string): { status: number; body: ImportValidationResult; log: Record<string, string | number> } {
  const validation = validateImportPayload(bytes, contentType)
  return { status: validation.status, body: validation, log: importValidationLog(validation) }
}
