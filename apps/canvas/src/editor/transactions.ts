import type { SceneDocument } from '../scene/nodeTypes.ts'

export interface EditorTransaction {
  id: string
  snapshot: SceneDocument
}

export function beginTransaction(document: SceneDocument, id: string): EditorTransaction {
  return { id, snapshot: structuredClone(document) }
}

export function commitTransaction(transaction: EditorTransaction): EditorTransaction {
  return transaction
}

export function rollbackTransaction(document: SceneDocument, transaction: EditorTransaction): SceneDocument {
  Object.assign(document, structuredClone(transaction.snapshot))
  return document
}

const undoStack: EditorTransaction[] = []
const redoStack: EditorTransaction[] = []

export function undoTransaction(document: SceneDocument): SceneDocument {
  const entry = undoStack.pop()
  if (!entry) {
    return document
  }
  redoStack.push(beginTransaction(document, `${entry.id}-redo`))
  return rollbackTransaction(document, entry)
}

export function redoTransaction(document: SceneDocument): SceneDocument {
  const entry = redoStack.pop()
  if (!entry) {
    return document
  }
  undoStack.push(beginTransaction(document, `${entry.id}-undo`))
  return rollbackTransaction(document, entry)
}

export function rememberTransaction(transaction: EditorTransaction): void {
  undoStack.push(transaction)
  redoStack.length = 0
}
