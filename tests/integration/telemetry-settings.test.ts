import { describe, expect, it } from 'vitest'
import { telemetrySettings } from '../../services/api/src/modules/admin/telemetrySettingsRoutes.ts'
describe('telemetry settings', () => { it('authorizes admins', () => { expect(telemetrySettings('GET', 'admin').status).toBe(200); expect(telemetrySettings('PATCH', 'editor').status).toBe(403) }) })
