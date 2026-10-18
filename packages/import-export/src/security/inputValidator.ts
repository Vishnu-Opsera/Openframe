import { createHash } from 'node:crypto'

export interface ImportValidationResult {
  status: number
  sanitizedBytesSha256: string
  findings: string[]
  contentType: string
  byteLength: number
  safeForSceneGraph: boolean
  validationStatus: 'rejected' | 'sanitized' | 'accepted'
}

export function sanitizeSvgPayload(bytes: Uint8Array): ImportValidationResult {
  const text = new TextDecoder().decode(bytes)
  if (text.includes('<script')) {
    return result(400, bytes, ['UNSAFE_SVG_SCRIPT'], 'image/svg+xml', false, 'rejected')
  }
  if (text.includes('<!ENTITY') || text.includes('<!DOCTYPE')) {
    return result(400, bytes, ['XML_EXTERNAL_ENTITY_BLOCKED'], 'image/svg+xml', false, 'rejected')
  }
  if (text.includes('onload=')) {
    const sanitized = text.replace(/onload="[^"]*"/g, '')
    return result(200, new TextEncoder().encode(sanitized), [], 'image/svg+xml', true, 'sanitized')
  }
  return result(200, bytes, [], 'image/svg+xml', true, 'accepted')
}

export function rejectXmlExternalEntities(bytes: Uint8Array): ImportValidationResult {
  return sanitizeSvgPayload(bytes)
}

export function validateImagePayload(bytes: Uint8Array): ImportValidationResult {
  const text = new TextDecoder().decode(bytes)
  if (text.includes('<script')) {
    return result(400, bytes, ['POLYGLOT_IMAGE_REJECTED'], 'image/png', false, 'rejected')
  }
  return result(200, bytes, [], 'image/png', true, 'accepted')
}

export function validatePdfPayload(bytes: Uint8Array): ImportValidationResult {
  const text = new TextDecoder().decode(bytes)
  if (!text.startsWith('%PDF')) {
    return result(400, bytes, ['INVALID_IMPORT_PAYLOAD'], 'application/pdf', false, 'rejected')
  }
  return result(200, bytes, [], 'application/pdf', true, 'accepted')
}

export function validateFigPayload(bytes: Uint8Array): ImportValidationResult {
  const text = new TextDecoder().decode(bytes)
  if (text.includes('javascript:')) {
    return result(400, bytes, ['UNSAFE_FIG_SCRIPT'], 'application/json', false, 'rejected')
  }
  return result(200, bytes, [], 'application/json', true, 'accepted')
}

export function validateImportPayload(bytes: Uint8Array, contentType: string): ImportValidationResult {
  if (contentType.includes('svg')) {
    return sanitizeSvgPayload(bytes)
  }
  if (contentType.includes('png')) {
    return validateImagePayload(bytes)
  }
  if (contentType.includes('pdf')) {
    return validatePdfPayload(bytes)
  }
  return validateFigPayload(bytes)
}

export function importValidationLog(validation: ImportValidationResult): Record<string, string | number> {
  return {
    operation: 'import.validate',
    contentType: validation.contentType,
    byteLength: validation.byteLength,
    validationStatus: validation.validationStatus,
    findingCodes: validation.findings.join(','),
  }
}

function result(status: number, bytes: Uint8Array, findings: string[], contentType: string, safeForSceneGraph: boolean, validationStatus: ImportValidationResult['validationStatus']): ImportValidationResult {
  return {
    status,
    sanitizedBytesSha256: createHash('sha256').update(bytes).digest('hex'),
    findings,
    contentType,
    byteLength: bytes.byteLength,
    safeForSceneGraph,
    validationStatus,
  }
}
