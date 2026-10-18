import { describe, expect, it } from 'vitest'
import { mapTokensToTailwindTheme } from './tailwindTokenMapper.ts'
describe('tailwind tokens', () => { it('maps theme keys', () => { const theme = mapTokensToTailwindTheme(); expect(theme['color.primary']).toContain('theme.extend') }) })
