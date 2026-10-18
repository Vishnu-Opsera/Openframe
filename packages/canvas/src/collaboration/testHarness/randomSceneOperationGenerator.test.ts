import { describe, expect, it } from 'vitest'
import { generateOperations } from './randomSceneOperationGenerator.ts'
describe('operation generator', () => {
  it('repeats a seed and changes with a different seed', () => {
    expect(generateOperations(7, 5)).toEqual(generateOperations(7, 5))
    expect(generateOperations(7, 5)).not.toEqual(generateOperations(8, 5))
  })
})
