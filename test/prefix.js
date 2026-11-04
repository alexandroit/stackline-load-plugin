import assert from 'node:assert/strict'
import {mkdtemp, mkdir, writeFile, rm, realpath} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join, dirname} from 'node:path'
import {spawnSync} from 'node:child_process'
import test from 'node:test'
import {loadPlugin, resolvePlugin} from '../index.js'

test('modern config preserves PREFIX global resolution without changing environment', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stackline-load-plugin-'))
  try {
    const prefix = join(directory, 'prefix with spaces')
    const packageDirectory = join(prefix, process.platform === 'win32' ? '' : 'lib', 'node_modules', 'stackline-test-plugin')
    await mkdir(packageDirectory, {recursive: true})
    await writeFile(join(packageDirectory, 'package.json'), JSON.stringify({type: 'module', exports: './index.js'}))
    await writeFile(join(packageDirectory, 'index.js'), 'export default "global plugin"\n')
    const script = `
      const before = {...process.env};
      const {loadPlugin} = await import(${JSON.stringify(new URL('../index.js', import.meta.url).href)});
      const result = await loadPlugin('stackline-test-plugin', {cwd: ${JSON.stringify(directory)}, global: true});
      if (result !== 'global plugin') throw new Error('Global plugin resolution changed');
      if (Object.keys(before).length !== Object.keys(process.env).length || !Object.keys(before).every(key => before[key] === process.env[key])) throw new Error('Host environment changed');
    `
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      cwd: directory,
      env: {PATH: process.env.PATH, PREFIX: prefix},
      encoding: 'utf8'
    })
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stderr, '')
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
})

test('global prefix rules preserve platform, DESTDIR, PREFIX precedence and Electron NVM behavior', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stackline-prefix-rules-'))
  try {
    const unixPrefix = join(directory, 'unix')
    const windowsPrefix = join(directory, 'windows')
    const explicit = join(directory, 'explicit prefix')
    const staging = join(directory, 'staging')
    const nvm = join(directory, 'nvm')
    const cases = [
      {platform: 'linux', execPath: join(unixPrefix, 'bin', 'node'), prefix: unixPrefix, env: {}},
      {platform: 'linux', execPath: join(unixPrefix, 'bin', 'node'), prefix: join(staging, unixPrefix), env: {DESTDIR: staging}},
      {platform: 'linux', execPath: join(unixPrefix, 'bin', 'node'), prefix: explicit, env: {PREFIX: explicit, DESTDIR: staging}},
      {platform: 'win32', execPath: join(windowsPrefix, 'node.exe'), prefix: windowsPrefix, env: {DESTDIR: staging}},
      {platform: 'win32', execPath: join(windowsPrefix, 'node.exe'), prefix: explicit, env: {PREFIX: explicit}},
      {platform: 'linux', execPath: join(directory, 'missing', 'bin', 'node'), prefix: nvm, env: {NVM_BIN: join(nvm, 'bin')}, electron: true}
    ]
    for (const scenario of cases) {
      const packageDirectory = join(scenario.prefix, scenario.platform === 'win32' ? '' : 'lib', 'node_modules', 'stackline-prefix-plugin')
      await mkdir(packageDirectory, {recursive: true})
      await writeFile(join(packageDirectory, 'package.json'), JSON.stringify({type: 'module', exports: './index.js'}))
      await writeFile(join(packageDirectory, 'index.js'), 'export default "prefix preserved"\n')
      const script = `
        Object.defineProperty(process, 'platform', {value: ${JSON.stringify(scenario.platform)}});
        Object.defineProperty(process, 'execPath', {value: ${JSON.stringify(scenario.execPath)}});
        ${scenario.electron ? "Object.defineProperty(process.versions, 'electron', {value: '1.0.0'});" : ''}
        const before = JSON.stringify(process.env);
        const {loadPlugin} = await import(${JSON.stringify(new URL('../index.js', import.meta.url).href)});
        const result = await loadPlugin('stackline-prefix-plugin', {cwd: ${JSON.stringify(directory)}, global: true});
        if (result !== 'prefix preserved') throw new Error('Global prefix behavior changed');
        if (JSON.stringify(process.env) !== before) throw new Error('Host environment changed');
      `
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
        cwd: directory,
        env: {PATH: process.env.PATH, ...scenario.env},
        encoding: 'utf8'
      })
      assert.equal(result.status, 0, JSON.stringify(scenario) + '\n' + result.stderr)
    }
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
})

test('missing paths keep fallback resolution and reject unresolved files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'stackline-load-fallback-'))
  try {
    const first = join(directory, 'first')
    const second = join(directory, 'second')
    await mkdir(first)
    await mkdir(second)
    await writeFile(join(second, 'plugin.mjs'), 'export default "second location"\n')
    assert.equal(await loadPlugin('./plugin.mjs', {cwd: [first, second], global: false}), 'second location')
    assert.equal(await resolvePlugin('./plugin.mjs', {cwd: [first, second], global: false}), await realpath(join(second, 'plugin.mjs')))
    await assert.rejects(resolvePlugin('./missing.mjs', {cwd: first, global: false}), {code: 'ERR_MODULE_NOT_FOUND'})
    await assert.rejects(resolvePlugin('./', {cwd: first, global: false}), {code: 'ERR_UNSUPPORTED_DIR_IMPORT'})
  } finally {
    await rm(directory, {recursive: true, force: true})
  }
})
