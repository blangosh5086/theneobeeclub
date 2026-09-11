import { spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, rename, symlink, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'artifacts/harness');
const contract = JSON.parse(await readFile(new URL('./brand-contract.json', import.meta.url), 'utf8'));
let buildDir;
let child;
const browserArgs = process.argv.slice(2).filter(arg => arg !== '--browser');
const runId = new Date().toISOString().replaceAll(':', '-');
const summary = { runId, startedAt: new Date().toISOString(), status: 'running', browserArgs, steps: [] };
async function run(label, executable, args, cwd = root, extra = {}) {
  console.log(`\n[NeoBee harness] ${label}`);
  summary.steps.push({ name: label, status: 'running' });
  const step = summary.steps.at(-1);
  await new Promise((resolve, reject) => {
    child = spawn(executable, args, {
      cwd, stdio: 'inherit',
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SITE_URL: contract.siteOrigin, ...extra }
    });
    child.on('error', reject);
    child.on('exit', code => {
      step.status = code === 0 ? 'passed' : 'failed';
      child = null;
      if (code === 0) resolve(); else reject(new Error(`${label} failed (exit ${code})`));
    });
  });
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child?.kill(signal));
await mkdir(output, { recursive: true });
// Preserve prior evidence, but never display its green report as the current run.
for (const entry of ['report', 'results', 'run.json']) {
  try {
    await mkdir(path.join(output, 'history', runId), { recursive: true });
    await rename(path.join(output, entry), path.join(output, 'history', runId, entry));
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await writeFile(path.join(output, 'run.json'), JSON.stringify(summary, null, 2));
try {
  if (!process.argv.includes('--browser')) await run('Content, lint and types', 'npm', ['run', 'check']);
  buildDir = await mkdtemp(path.join(tmpdir(), 'neobee-harness-'));
  // A clean copy prevents Next builds and generated type files from clobbering a live dev server.
  for (const entry of ['src', 'public', 'package.json', 'package-lock.json', 'next.config.ts', 'next-intl.config.js', 'postcss.config.mjs', 'eslint.config.mjs', 'tsconfig.json', 'middleware.ts']) {
    await cp(path.join(root, entry), path.join(buildDir, entry), { recursive: true });
  }
  await symlink(path.join(root, 'node_modules'), path.join(buildDir, 'node_modules'), 'dir');
  await run('Clean production build', 'npm', ['run', 'build'], buildDir);
  await run('Browser, brand and publishing contracts', process.execPath,
    [path.join(root, 'node_modules/@playwright/test/cli.js'), 'test', ...browserArgs], root, { NEOBEE_HARNESS_BUILD: buildDir });
  summary.status = 'passed';
} catch (error) {
  summary.status = 'failed';
  summary.error = error.message;
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  summary.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'run.json'), JSON.stringify(summary, null, 2));
  if (buildDir) await rm(buildDir, { recursive: true, force: true });
  const browserRan = summary.steps.some(step => step.name === 'Browser, brand and publishing contracts');
  console.log(`\n[NeoBee harness] ${summary.status}. Evidence: artifacts/harness/run.json${browserRan ? ' (npm run report)' : '; no browser report for this run'}`);
}
