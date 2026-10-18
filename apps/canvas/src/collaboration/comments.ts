export interface CommentThread {
  id: string
  body: string
  replies: string[]
  resolved: boolean
  draft: boolean
}

export function createCommentThread(threads: CommentThread[], body: string): CommentThread {
  const thread = { id: `thread-${threads.length + 1}`, body, replies: [], resolved: false, draft: false }
  threads.push(thread)
  return thread
}

export function addCommentReply(thread: CommentThread, body: string): void {
  thread.replies.push(body)
}

export function resolveCommentThread(thread: CommentThread): void {
  thread.resolved = true
}

export function reopenCommentThread(thread: CommentThread): void {
  thread.resolved = false
}

export function deleteCommentDraft(threads: CommentThread[], id: string): CommentThread[] {
  return threads.filter((thread) => !(thread.id === id && thread.draft))
}
