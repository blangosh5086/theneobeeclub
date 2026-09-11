import { spawn } from 'node:child_process';
import path from 'node:path';
const cwd = process.env.NEOBEE_HARNESS_BUILD;
if (!cwd) throw new Error('Run npm run verify or npm run test:browser to build an isolated test copy first.');
const server = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '3107'], { cwd, stdio: 'inherit', env: process.env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', code => { process.exitCode = code ?? 1; });
