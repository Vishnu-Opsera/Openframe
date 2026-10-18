import { describe, expect, it } from 'vitest'
import { addCommentReply, createCommentThread, deleteCommentDraft, reopenCommentThread, resolveCommentThread } from '../comments.ts'

describe('comments', () => {
  it('creates replies and resolves threads', () => {
    const threads = []
    const thread = createCommentThread(threads, 'Looks good')
    addCommentReply(thread, 'Thanks')
    resolveCommentThread(thread)
    reopenCommentThread(thread)
    thread.draft = true
    expect(deleteCommentDraft(threads, thread.id)).toHaveLength(0)
  })
})
