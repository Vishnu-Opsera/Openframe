import { readFileSync } from 'node:fs'

const files = [
  'package.json',
  'pnpm-lock.yaml',
  'src-tauri/Cargo.toml',
  'src-tauri/Cargo.lock',
]

const prohibited = ['electron-builder', 'electron-updater', 'electron']

const hits = []

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  for (const name of prohibited) {
    const pattern = new RegExp(`(^|[^A-Za-z0-9_-])${name}([^A-Za-z0-9_-]|$)`, 'm')
    if (pattern.test(text)) {
      hits.push(`${file} contains ${name}`)
    }
  }
}

if (hits.length > 0) {
  console.error(hits.join('\n'))
  process.exit(1)
}

console.log('No prohibited desktop runtime dependencies found.')
