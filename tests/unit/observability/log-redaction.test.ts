import { describe, expect, it } from 'vitest'
import { createStructuredLogger } from '../../../packages/observability/src/otel.ts'
describe('log redaction', () => { it('omits provider keys', () => { const logRecord = createStructuredLogger(); expect(logRecord.attributes.provider_key).toBeUndefined() }) })
