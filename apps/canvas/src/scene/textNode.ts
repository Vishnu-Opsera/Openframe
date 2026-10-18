export interface VariableFontAxis {
  tag: string
  min: number
  max: number
  defaultValue: number
  value: number
}

export interface OpenTypeFeature {
  tag: string
  enabled: boolean
}

export interface FontDescriptor {
  fontFamily: string
  fontStyle: string
  variableAxes: VariableFontAxis[]
  features: OpenTypeFeature[]
}

export interface TextRun {
  start: number
  end: number
  fontSize: number
  font: FontDescriptor
}

export interface ParagraphStyle {
  alignment: 'left' | 'center' | 'right'
  lineHeight: number
  letterSpacing: number
}

export type TextOverflowMode = 'visible' | 'clip' | 'ellipsis'

export interface TextNode {
  id: string
  content: string
  runs: TextRun[]
  paragraph: ParagraphStyle
  overflow: TextOverflowMode
  bounds: { x: number; y: number; width: number; height: number }
}

export function defaultFont(family = 'Inter'): FontDescriptor {
  return {
    fontFamily: family,
    fontStyle: 'Regular',
    variableAxes: [{ tag: 'wght', min: 100, max: 900, defaultValue: 400, value: 400 }],
    features: [{ tag: 'liga', enabled: true }],
  }
}

export function createTextNode(id: string, content: string): TextNode {
  return {
    id,
    content,
    runs: [{ start: 0, end: content.length, fontSize: 16, font: defaultFont() }],
    paragraph: { alignment: 'left', lineHeight: 20, letterSpacing: 0 },
    overflow: 'visible',
    bounds: { x: 0, y: 0, width: 160, height: 24 },
  }
}
