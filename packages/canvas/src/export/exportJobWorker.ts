export function enqueueExport(target: string): { status: number; artifactType?: string; error?: { code: string } } {
  if (['react-tailwind', 'swiftui', 'flutter', 'html-css'].includes(target)) return { status: 202, artifactType: target }
  return { status: 400, error: { code: 'UNSUPPORTED_TARGET' } }
}
