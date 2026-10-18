import type { CommentsApi } from './comments.ts'
import type { MutationsApi } from './mutations.ts'
import type { SceneGraphApi } from './sceneGraph.ts'
import type { SelectionApi } from './selections.ts'
export interface PluginDeniedResult { ok: false; code: 'PLUGIN_CAPABILITY_DENIED' }
export interface PluginResult { ok: true }
export interface CanvasPluginSdk { scene: SceneGraphApi; selection: SelectionApi; comments: CommentsApi; mutations: MutationsApi }
export function createCanvasPluginSdk(send: (type: string) => { ok: boolean; code?: string }): CanvasPluginSdk {
  return { scene: { findNodes: () => { send('scene.findNodes'); return [] } }, selection: { getCurrent: () => { send('selection.getCurrent'); return 'node' } }, comments: { create: () => { send('comments.create'); return 'comment' } }, mutations: { apply: () => { send('mutations.apply'); return 'mutation' } } }
}
