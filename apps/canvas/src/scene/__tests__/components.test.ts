import { describe, expect, it } from 'vitest'
import { applyInstanceOverride, createComponent, createInstance, defineVariantSet, detachInstance, resetInstanceOverride, switchVariant, updateVariantProp, type ComponentRegistry } from '../components.ts'

describe('components', () => {
  it('creates components, instances, variants, and overrides', () => {
    const registry: ComponentRegistry = { components: {}, instances: {} }
    createComponent(registry, 'button')
    defineVariantSet(registry, 'button', ['default', 'primary'])
    updateVariantProp(registry, 'button', 'label', 'Save')
    createInstance(registry, 'button', 'instance-1')
    applyInstanceOverride(registry, 'instance-1', 'label', 'Custom')
    switchVariant(registry, 'instance-1', 'primary')
    expect(registry.instances['instance-1']?.variant).toBe('primary')
    resetInstanceOverride(registry, 'instance-1')
    expect(registry.instances['instance-1']?.overrides).toEqual({})
    detachInstance(registry, 'instance-1')
    expect(registry.instances['instance-1']?.detached).toBe(true)
  })
})
