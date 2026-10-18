import { useEffect, useState } from 'react'
import { loadEditorCore, type EditorCoreLoad } from '../editorCore/loadEditorCore'

export function EditorViewport({
  loader = loadEditorCore,
}: {
  loader?: () => Promise<EditorCoreLoad>
}) {
  const [state, setState] = useState<EditorCoreLoad | { status: 'loading' }>({ status: 'loading' })

  useEffect(() => {
    let active = true
    void loader().then((next) => {
      if (active) {
        setState(next)
      }
    })
    return () => {
      active = false
    }
  }, [loader])

  if (state.status === 'loading') {
    return <p data-testid="editor-core-loading">Loading Openframe editor core</p>
  }
  if (state.status === 'error') {
    return <p data-testid="editor-core-error">{state.message}</p>
  }
  return (
    <p className="core-chip" data-testid="editor-core-ready">
      Core {state.version}
    </p>
  )
}
