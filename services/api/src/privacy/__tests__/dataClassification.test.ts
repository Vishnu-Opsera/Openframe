import { describe, expect, it } from 'vitest'
import { dataEntityTypes, getDataClassification } from '../dataClassification.ts'
describe('data classification', () => {
  it('classifies provider configs and audit events', () => {
    expect(dataEntityTypes).toContain('design_files')
    expect(getDataClassification('ai_provider_configs').classification).toBe('Restricted')
    expect(getDataClassification('audit_events').retentionCategory).toBe('audit_1_year_minimum')
  })
})
