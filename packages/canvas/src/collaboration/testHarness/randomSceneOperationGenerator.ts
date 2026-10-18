export function generateOperations(seed: number, count: number): string[] {
  let state = seed
  const operations: string[] = []
  for (let index = 0; index < count; index += 1) {
    state = (state * 1664525 + 1013904223) % 4294967296
    operations.push(`op-${state % 7}-${index}`)
  }
  return operations
}
