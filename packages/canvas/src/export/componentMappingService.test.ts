import { describe, expect, it } from 'vitest'
import { mapDesignComponentsToRepositoryComponents } from './componentMappingService.ts'
describe('mapping', () => { it('maps library components', () => { expect(mapDesignComponentsToRepositoryComponents()).toEqual(['Button', 'TextInput', 'Card', 'Icon']) }) })
