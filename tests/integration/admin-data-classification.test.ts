import { describe, expect, it } from 'vitest'
import { getDataClassificationRoute } from '../../services/api/src/modules/admin/dataClassificationRoutes.ts'
describe('admin data classification', () => {
  it('allows admins and rejects others', () => {
    expect(getDataClassificationRoute('admin').status).toBe(200)
    expect(getDataClassificationRoute('anonymous').status).toBe(401)
    expect(getDataClassificationRoute('editor').status).toBe(403)
  })
})
