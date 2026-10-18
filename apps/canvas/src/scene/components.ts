export interface ComponentRecord {
  id: string
  variants: string[]
  props: Record<string, string>
}

export interface InstanceRecord {
  id: string
  componentId: string
  variant: string
  overrides: Record<string, string>
  detached: boolean
}

export interface ComponentRegistry {
  components: Record<string, ComponentRecord>
  instances: Record<string, InstanceRecord>
}

export function createComponent(registry: ComponentRegistry, id: string): ComponentRecord {
  const record = { id, variants: ['default'], props: { label: 'Openframe' } }
  registry.components[id] = record
  return record
}

export function createInstance(registry: ComponentRegistry, componentId: string, instanceId: string): InstanceRecord {
  const instance = { id: instanceId, componentId, variant: 'default', overrides: {}, detached: false }
  registry.instances[instanceId] = instance
  return instance
}

export function defineVariantSet(registry: ComponentRegistry, componentId: string, variants: string[]): void {
  const component = registry.components[componentId]
  if (component) {
    component.variants = variants
  }
}

export function updateVariantProp(registry: ComponentRegistry, componentId: string, key: string, value: string): void {
  const component = registry.components[componentId]
  if (component) {
    component.props[key] = value
  }
}

export function applyInstanceOverride(registry: ComponentRegistry, instanceId: string, key: string, value: string): void {
  const instance = registry.instances[instanceId]
  if (instance && !instance.detached) {
    instance.overrides[key] = value
  }
}

export function resetInstanceOverride(registry: ComponentRegistry, instanceId: string): void {
  const instance = registry.instances[instanceId]
  if (instance) {
    instance.overrides = {}
  }
}

export function switchVariant(registry: ComponentRegistry, instanceId: string, variant: string): void {
  const instance = registry.instances[instanceId]
  const component = instance ? registry.components[instance.componentId] : undefined
  if (instance && component?.variants.includes(variant)) {
    instance.variant = variant
  }
}

export function detachInstance(registry: ComponentRegistry, instanceId: string): void {
  const instance = registry.instances[instanceId]
  if (instance) {
    instance.detached = true
  }
}
