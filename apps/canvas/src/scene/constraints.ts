export type ConstraintMode = 'left' | 'right' | 'top' | 'bottom' | 'center' | 'scale' | 'fixed' | 'stretch'

export interface ConstraintBox {
  x: number
  y: number
  width: number
  height: number
}

export function resolveConstraint(child: ConstraintBox, previousParent: ConstraintBox, nextParent: ConstraintBox, constraint: ConstraintMode): ConstraintBox {
  const parentWidth = Number.isFinite(nextParent.width) ? Math.max(0, nextParent.width) : 0
  const parentHeight = Number.isFinite(nextParent.height) ? Math.max(0, nextParent.height) : 0
  const previousWidth = Math.max(previousParent.width, 1)
  const previousHeight = Math.max(previousParent.height, 1)
  if (constraint === 'fixed' || constraint === 'left') {
    return { ...child, x: child.x, y: constraint === 'left' ? child.y : child.y }
  }
  if (constraint === 'right') {
    const margin = previousParent.width - (child.x + child.width)
    return { ...child, x: parentWidth - child.width - margin }
  }
  if (constraint === 'top') {
    return { ...child, y: child.y }
  }
  if (constraint === 'bottom') {
    const margin = previousParent.height - (child.y + child.height)
    return { ...child, y: parentHeight - child.height - margin }
  }
  if (constraint === 'center') {
    return { ...child, x: (parentWidth - child.width) / 2, y: (parentHeight - child.height) / 2 }
  }
  if (constraint === 'scale') {
    return {
      x: (child.x / previousWidth) * parentWidth,
      y: (child.y / previousHeight) * parentHeight,
      width: (child.width / previousWidth) * parentWidth,
      height: (child.height / previousHeight) * parentHeight,
    }
  }
  return { ...child, width: parentWidth, height: child.height }
}
