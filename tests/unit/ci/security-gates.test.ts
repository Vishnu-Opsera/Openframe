import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
describe('security gates', () => { it('lists scan jobs', () => { const source = readFileSync('.forge/shipping.yml', 'utf8'); for (const name of ['scan:sonarqube', 'scan:snyk', 'scan:gitleaks', 'scan:semgrep', 'scan:grype', 'sbom:generate', 'attest:artifacts']) expect(source).toContain(name) }) })
