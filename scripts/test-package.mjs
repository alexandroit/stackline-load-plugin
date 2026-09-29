import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync} from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
const temp = mkdtempSync(path.join(os.tmpdir(), 'stackline-load-plugin-packed-'))
function npm(args, cwd) {
  return execFileSync(process.execPath, [process.env.npm_execpath, ...args], {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']})
}
try {
  const packed = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temp], root))
  assert.equal(packed.length, 1)
  const archive = path.join(temp, packed[0].filename)
  for (const key of [manifest.name, 'load-plugin']) {
    const cwd = path.join(temp, key.replace(/[^a-z0-9-]/gi, '-'))
    mkdirSync(cwd)
    writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({name: 'packed-loader-consumer', private: true, version: '1.0.0', dependencies: {[key]: `file:${archive}`}}))
    writeFileSync(path.join(cwd, 'plugin.mjs'), 'export default 42\n')
    npm(['install', '--ignore-scripts', '--omit=dev', '--no-fund'], cwd)
    const installed = JSON.parse(readFileSync(path.join(cwd, 'node_modules', key, 'package.json'), 'utf8'))
    assert.equal(installed.name, manifest.name)
    assert.equal(installed.version, manifest.version)
    assert.deepEqual(installed.dependencies, manifest.dependencies)
    const probe = `import assert from 'node:assert/strict'; import {resolvePlugin, loadPlugin} from ${JSON.stringify(key)}; const cwd = process.cwd(); assert.equal(await loadPlugin('./plugin.mjs', {cwd}), 42); assert.equal(await resolvePlugin('./plugin.mjs', {cwd}), cwd + '/plugin.mjs');`
    execFileSync(process.execPath, ['--input-type=module', '-e', probe], {cwd, stdio: 'pipe'})
    const audit = JSON.parse(npm(['audit', '--omit=dev', '--json'], cwd))
    assert.equal(audit.metadata.vulnerabilities.total, 0)
    const tree = JSON.parse(npm(['ls', '--all', '--omit=dev', '--json'], cwd))
    assert.deepEqual(tree.problems || [], [])
  }
  console.log('Packed direct/legacy-name consumers: ESM loading, resolution, dependency aliases and production audit passed.')
} finally {
  rmSync(temp, {recursive: true, force: true})
}
