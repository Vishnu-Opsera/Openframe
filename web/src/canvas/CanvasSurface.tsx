import { useEffect } from 'react'

type SceneNode = {
  hidden?: boolean
  children?: SceneNode[]
}

function countVisible(nodes: SceneNode[] | undefined): number {
  if (!nodes) {
    return 0
  }
  return nodes.reduce((total, node) => total + (node.hidden ? 0 : 1) + countVisible(node.children), 0)
}

declare global {
  interface Window {
    canvasDebug?: { lastRenderDeltaCount: number; backend: 'webgpu' | 'webgl2' }
  }
}

export function CanvasSurface() {
  useEffect(() => {
    void fetch('/fixtures/renderer/basic_scene.canvas.json')
      .then((response) => response.json())
      .then((scene: { pages?: SceneNode[] }) => {
        const backend = navigator.gpu ? 'webgpu' : 'webgl2'
        window.canvasDebug = { lastRenderDeltaCount: countVisible(scene.pages), backend }
      })
      .catch(() => {
        window.canvasDebug = { lastRenderDeltaCount: 0, backend: navigator.gpu ? 'webgpu' : 'webgl2' }
      })
  }, [])

  return <canvas data-testid="canvas-surface" width={2} height={2} />
}
