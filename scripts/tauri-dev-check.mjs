import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'

const config = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8'))
const devUrl = config.build?.devUrl
const frontendDist = config.build?.frontendDist

if (devUrl !== 'http://127.0.0.1:5173') {
  console.error('tauri.conf.json devUrl must load the Vite development server.')
  process.exit(1)
}

if (frontendDist !== '../dist') {
  console.error('tauri.conf.json frontendDist must use the Vite dist directory.')
  process.exit(1)
}

const child = spawn('pnpm', ['exec', 'tauri', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
})

let output = ''
const timer = setTimeout(() => {
  child.kill('SIGTERM')
  console.error('Timed out waiting for the Openframe desktop shell to start.')
  process.exit(1)
}, 180000)

function finish(code) {
  clearTimeout(timer)
  child.kill('SIGTERM')
  process.exit(code)
}

child.stdout.on('data', (chunk) => {
  output += chunk.toString()
  process.stdout.write(chunk)
  if (output.includes('Running') || output.includes('App listening') || output.includes('5173')) {
    console.log('Openframe desktop shell started against the Vite UI.')
    finish(0)
  }
})

child.stderr.on('data', (chunk) => {
  output += chunk.toString()
  process.stderr.write(chunk)
})

child.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    clearTimeout(timer)
    process.exit(code)
  }
})
