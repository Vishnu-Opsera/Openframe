import { useEffect, useRef } from 'react'

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
    canvasDebug?: { lastRenderDeltaCount: number; backend: 'webgpu' | 'webgl2'; visiblePrimitiveCount?: number; forcedBackend?: 'webgpu' | 'webgl2' }
  }
}

function paintStage(canvas: HTMLCanvasElement) {
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
  const boardWidth = Math.min(760, width - 96)
  const boardHeight = Math.min(460, height - 96)
  const originX = (width - boardWidth) / 2
  const originY = (height - boardHeight) / 2
  context.fillStyle = 'rgba(0,0,0,0.35)'
  context.fillRect(originX + 12, originY + 16, boardWidth, boardHeight)
  context.fillStyle = '#f7f4ee'
  context.fillRect(originX, originY, boardWidth, boardHeight)
  context.fillStyle = '#e4572e'
  context.fillRect(originX + 36, originY + 36, 72, 8)
  context.fillStyle = '#17181c'
  context.font = '600 42px ui-sans-serif, system-ui, sans-serif'
  context.fillText('Design, owned.', originX + 36, originY + 110)
  context.fillStyle = '#5c574e'
  context.font = '16px ui-sans-serif, system-ui, sans-serif'
  context.fillText('A quiet canvas for product teams.', originX + 36, originY + 142)
  context.fillStyle = '#111216'
  context.fillRect(originX + 36, originY + 188, 148, 44)
  context.fillStyle = '#f7f4ee'
  context.font = '600 14px ui-sans-serif, system-ui, sans-serif'
  context.fillText('Start a frame', originX + 56, originY + 215)
  context.strokeStyle = '#d9d3c7'
  context.strokeRect(originX + 200, originY + 188, 148, 44)
  context.fillStyle = '#17181c'
  context.fillText('Invite', originX + 248, originY + 215)
}

export function CanvasSurface() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      paintStage(canvas)
    }
    const onResize = () => {
      if (canvasRef.current) {
        paintStage(canvasRef.current)
      }
    }
    window.addEventListener('resize', onResize)
    void fetch('/fixtures/renderer/basic_scene.canvas.json')
      .then((response) => response.json())
      .then((scene: { pages?: SceneNode[] }) => {
        const forced = new URLSearchParams(window.location.search).get('backend')
        const backend = forced === 'webgl2' || forced === 'webgpu' ? forced : navigator.gpu ? 'webgpu' : 'webgl2'
        window.canvasDebug = { lastRenderDeltaCount: countVisible(scene.pages), backend, visiblePrimitiveCount: countVisible(scene.pages) }
      })
      .catch(() => {
        window.canvasDebug = { lastRenderDeltaCount: 0, backend: navigator.gpu ? 'webgpu' : 'webgl2' }
      })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <canvas ref={canvasRef} className="design-canvas" data-testid="canvas-surface" />
}
