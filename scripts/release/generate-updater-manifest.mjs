import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const channels = new Set(['stable', 'beta', 'nightly'])

function fail(code, message, artifact) {
  const error = new Error(message)
  error.code = code
  error.artifact = artifact ?? null
  throw error
}

function readArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1 || !process.argv[index + 1]) {
    return fallback
  }
  return process.argv[index + 1]
}

export function buildManifest({ channel, version, artifacts, checksums, endpoint }) {
  if (!channels.has(channel)) {
    fail('invalid_channel', `Unknown updater channel ${channel}`)
  }
  if (!endpoint) {
    fail('missing_endpoint', 'TAURI_UPDATER_ENDPOINT placeholder is missing')
  }
  const platforms = {}
  for (const artifact of artifacts.artifacts) {
    const checksum = checksums[artifact.path]
    if (!checksum) {
      fail('missing_checksum', 'Artifact checksum is missing', artifact.path)
    }
    platforms[artifact.platform] = {
      url: `${endpoint.replace(/\/$/, '')}/${channel}/${artifact.path}`,
      signature: '${TAURI_UPDATER_PUBLIC_KEY}',
      checksum,
    }
  }
  return {
    version,
    notes: artifacts.notes,
    pub_date: '2026-03-15T00:00:00Z',
    platforms,
  }
}

const isDirectRun = process.argv[1]?.endsWith('generate-updater-manifest.mjs')
if (isDirectRun) {
  const channel = readArg('channel', '')
  const version = readArg('version', '')
  const artifacts = JSON.parse(readFileSync('tests/fixtures/updater/artifacts.json', 'utf8'))
  const checksums = JSON.parse(readFileSync('tests/fixtures/updater/checksums.json', 'utf8'))
  const endpoint = process.env.TAURI_UPDATER_ENDPOINT || '${TAURI_UPDATER_ENDPOINT}'
  let manifest
  try {
    manifest = buildManifest({ channel, version, artifacts, checksums, endpoint })
  } catch (error) {
    console.error(JSON.stringify({ code: error.code, message: error.message, artifact: error.artifact ?? null }))
    process.exit(1)
  }
  const destination = `dist/updater/${channel}/latest.json`
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, `${JSON.stringify(manifest, null, 2)}\n`)
}
