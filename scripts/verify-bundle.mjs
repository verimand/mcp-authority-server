import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const bundle = resolve('dist/stdio.js');
if (!existsSync(bundle) || !statSync(bundle).isFile()) {
  throw new Error('The published dist/stdio.js bundle is missing.');
}

const syntax = spawnSync(process.execPath, ['--check', bundle], {
  stdio: 'inherit',
});
if (syntax.error) throw syntax.error;
if (syntax.status !== 0) process.exit(syntax.status ?? 1);

console.log('Published MCP bundle verified.');
