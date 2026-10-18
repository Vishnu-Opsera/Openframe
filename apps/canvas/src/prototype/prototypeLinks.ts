export interface PrototypeLink {
  id: string
  sourceId: string
  targetId: string
  transition: 'instant' | 'dissolve' | 'slide'
  durationMs: number
}

export function validatePrototypeTarget(sourceId: string, targetId: string): boolean {
  return sourceId.length > 0 && targetId.length > 0 && sourceId !== targetId
}

export function createPrototypeLink(links: PrototypeLink[], sourceId: string, targetId: string): PrototypeLink | { error: string } {
  if (!validatePrototypeTarget(sourceId, targetId)) {
    return { error: 'invalid_target' }
  }
  const link = { id: `link-${links.length + 1}`, sourceId, targetId, transition: 'dissolve' as const, durationMs: 200 }
  links.push(link)
  return link
}

export function updateTransition(link: PrototypeLink, transition: PrototypeLink['transition'], durationMs: number): void {
  link.transition = transition
  link.durationMs = durationMs
}

export function removePrototypeLink(links: PrototypeLink[], id: string): PrototypeLink[] {
  return links.filter((link) => link.id !== id)
}
