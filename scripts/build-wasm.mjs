import { mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const cargo = spawnSync(
  'cargo',
  ['build', '--manifest-path', 'crates/editor-core/Cargo.toml', '--target', 'wasm32-unknown-unknown', '--release'],
  { stdio: 'inherit', env: { ...process.env, PATH: `${process.env.HOME}/.cargo/bin:${process.env.PATH}` } },
)
if (cargo.status !== 0) {
  process.exit(cargo.status ?? 1)
}

mkdirSync('public/wasm', { recursive: true })
const bindgen = spawnSync(
  'wasm-bindgen',
  [
    '--target',
    'web',
    '--out-dir',
    'public/wasm',
    '--out-name',
    'editor_core',
    'crates/editor-core/target/wasm32-unknown-unknown/release/editor_core.wasm',
  ],
  { stdio: 'inherit', env: { ...process.env, PATH: `${process.env.HOME}/.cargo/bin:${process.env.PATH}` } },
)
if (bindgen.status !== 0) {
  process.exit(bindgen.status ?? 1)
}

writeFileSync(
  'public/wasm/editor-core-manifest.json',
  `${JSON.stringify(
    {
      name: 'editor-core',
      version: '0.1.0',
      runtime_target: 'wasm32-unknown-unknown',
      module: '/wasm/editor_core.js',
      binary: '/wasm/editor_core_bg.wasm',
      capabilities: ['status'],
      renderer_boundary: 'external',
    },
    null,
    2,
  )}\n`,
)
