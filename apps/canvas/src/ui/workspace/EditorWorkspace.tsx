import { useEffect, useState } from 'react'
import { currentDocument } from '../../editor/commandBus.ts'
import { handleKeyboardEvent } from '../shortcuts/keyboardController.ts'
import { Toolbar } from '../toolbar/Toolbar.tsx'

export function EditorWorkspace() {
  const [lastAction, setLastAction] = useState('ready')
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : 'div'
      const result = handleKeyboardEvent({
        key: event.key.length === 1 ? event.key.toUpperCase() : event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        repeat: event.repeat,
        targetTag: target,
      })
      if (result.actionId) {
        setLastAction(result.actionId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const count = Object.keys(currentDocument().nodes).length
  return (
    <section data-testid="editor-workspace" data-last-action={lastAction}>
      <Toolbar />
      <canvas data-testid="gpu-canvas" data-node-count={count} />
    </section>
  )
}
