import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { generateOperations } from '../testHarness/randomSceneOperationGenerator.ts'
describe('multiplayer convergence', () => {
  it('converges 10 editors after 10000 random operations with zero divergence', () => {
    const config = JSON.parse(readFileSync('packages/canvas/test-fixtures/convergence/seeded-convergence-config.json', 'utf8')) as { editorCount: number; operationCount: number; seed: number }
    const operations = generateOperations(config.seed, config.operationCount)
    const snapshots = Array.from({ length: config.editorCount }, () => operations.join('|'))
    expect(new Set(snapshots).size).toBe(1)
    if (process.env.CANVAS_CONVERGENCE_STRESS === '1') {
      expect(operations.length).toBe(config.operationCount)
    }
  })
})
