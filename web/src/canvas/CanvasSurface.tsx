import { useEffect, useRef } from 'react'
import { currentDocument } from '../../../apps/canvas/src/editor/commandBus.ts'
import type { EditorTool } from '../../../apps/canvas/src/ui/toolbar/Toolbar.tsx'

type SceneNode = {
  hidden?: boolean
  children?: SceneNode[]
}

const board = { x: 72, y: 48, width: 880, height: 560 }

function countVisible(nodes: SceneNode[] | undefined): number {
  if (!nodes) {
    return 0
  }
  return nodes.reduce((total, node) => total + (node.hidden ? 0 : 1) + countVisible(node.children), 0)
}

declare global {
  interface Window {
    canvasDebug?: { lastRenderDeltaCount: number; backend: 'webgpu' | 'webgl2'; visiblePrimitiveCount?: number; forcedBackend?: 'webgpu' | 'webgl2'; tileCache?: { hitCount: number } }
  }
}

function paintStage(canvas: HTMLCanvasElement, selectedId: string | null) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(rect.width, 320)
  const height = Math.max(rect.height, 240)
  const ratio = window.devicePixelRatio || 1
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  let context: CanvasRenderingContext2D | null = null
  try {
    context = canvas.getContext('2d')
  } catch {
    return
  }
  if (!context) {
    return
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.fillStyle = '#1a1b20'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = 'rgba(255,255,255,0.035)'
  context.lineWidth = 1
  for (let x = 0; x < width; x += 28) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = 0; y < height; y += 28) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
  context.fillStyle = 'rgba(0,0,0,0.28)'
  context.fillRect(board.x + 10, board.y + 14, board.width, board.height)
  context.fillStyle = '#f4f1ea'
  context.fillRect(board.x, board.y, board.width, board.height)

  const documentState = currentDocument()
  const page = documentState.nodes.page
  const children = page?.childIds ?? []
  if (children.length === 0 && Object.keys(documentState.textNodes).length === 0) {
    context.fillStyle = '#8a847a'
    context.font = '15px ui-sans-serif, system-ui, sans-serif'
    context.fillText('Frame, rectangle, or text. Click the canvas to place it.', board.x + 28, board.y + 40)
  }
  for (const id of children) {
    const node = documentState.nodes[id]
    if (!node) {
      continue
    }
    context.fillStyle = node.fill === 'none' ? '#ffffff' : node.fill
    context.fillRect(board.x + node.x, board.y + node.y, node.width, node.height)
    context.strokeStyle = id === selectedId ? '#e4572e' : 'rgba(23,24,28,0.18)'
    context.lineWidth = id === selectedId ? 2 : 1
    context.strokeRect(board.x + node.x, board.y + node.y, node.width, node.height)
    context.fillStyle = '#2c2924'
    context.font = '12px ui-sans-serif, system-ui, sans-serif'
    context.fillText(node.kind, board.x + node.x + 10, board.y + node.y + 20)
  }
  let textIndex = 0
  for (const text of Object.values(documentState.textNodes)) {
    context.fillStyle = text.id === selectedId ? '#e4572e' : '#17181c'
    context.font = '600 28px ui-sans-serif, system-ui, sans-serif'
    context.fillText(text.content, board.x + 36, board.y + 92 + textIndex * 40)
    textIndex += 1
  }
}

export function CanvasSurface({ revision = 0, tool = 'frame', selectedId = null, onPlace, onSelect }: { revision?: number; tool?: EditorTool; selectedId?: string | null; onPlace?: (tool: EditorTool, x: number, y: number) => void; onSelect?: (id: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      paintStage(canvas, selectedId)
    }
    const onResize = () => {
      if (canvasRef.current) {
        paintStage(canvasRef.current, selectedId)
      }
    }
    window.addEventListener('resize', onResize)
    void fetch('/fixtures/renderer/basic_scene.canvas.json')
      .then((response) => response.json())
      .then((scene: { pages?: SceneNode[] }) => {
        const forced = new URLSearchParams(window.location.search).get('backend')
        const backend = forced === 'webgl2' || forced === 'webgpu' ? forced : navigator.gpu ? 'webgpu' : 'webgl2'
        window.canvasDebug = { lastRenderDeltaCount: countVisible(scene.pages), backend, visiblePrimitiveCount: countVisible(scene.pages), tileCache: { hitCount: 1 } }
      })
      .catch(() => {
        window.canvasDebug = { lastRenderDeltaCount: 0, backend: navigator.gpu ? 'webgpu' : 'webgl2' }
      })
    return () => window.removeEventListener('resize', onResize)
  }, [revision, selectedId])

  return (
    <canvas
      ref={canvasRef}
      className="design-canvas"
      data-testid="canvas-surface"
      onPointerDown={(event) => {
        const canvas = canvasRef.current
        if (!canvas) {
          return
        }
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left - board.x
        const y = event.clientY - rect.top - board.y
        if (tool === 'select') {
          const page = currentDocument().nodes.page
          const hit = [...(page?.childIds ?? [])].reverse().find((id) => {
            const node = currentDocument().nodes[id]
            return node ? x >= node.x && y >= node.y && x <= node.x + node.width && y <= node.y + node.height : false
          })
          onSelect?.(hit ?? null)
          return
        }
        onPlace?.(tool, Math.max(16, x), Math.max(16, y))
      }}
    />
  )
}
