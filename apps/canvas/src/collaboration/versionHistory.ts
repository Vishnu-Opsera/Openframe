import type { CommentThread } from './comments.ts'
import type { PrototypeLink } from '../prototype/prototypeLinks.ts'

export interface VersionRecord {
  id: string
  name: string
  summary: string
}

export interface ReviewState {
  links: PrototypeLink[]
  threads: CommentThread[]
  versions: VersionRecord[]
}

export function createNamedVersion(versions: VersionRecord[], name: string): VersionRecord {
  const version = { id: `version-${versions.length + 1}`, name, summary: name }
  versions.push(version)
  return version
}

export function listVersions(versions: VersionRecord[]): VersionRecord[] {
  return [...versions]
}

export function diffVersionSummary(version: VersionRecord): string {
  return `changed:${version.name}`
}

export function restoreVersionTransaction(version: VersionRecord): { transactionId: string; versionId: string } {
  return { transactionId: `restore-${version.id}`, versionId: version.id }
}
