const fs = require('fs');
const path = require('path');

const roots = [
  path.join(process.cwd(), 'apps', 'web', 'src'),
  path.join(process.cwd(), 'apps', 'api', 'src'),
  path.join(process.cwd(), 'packages'),
].filter((dir) => fs.existsSync(dir));

const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.scss', '.yml', '.yaml']);
const suspects = ['?', '?'];

const ignoreDirs = new Set(['node_modules', 'dist', 'build', '.git']);
const problems = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (!exts.has(path.extname(entry.name))) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const hits = suspects.filter((token) => content.includes(token));
    if (hits.length) {
      problems.push({ file: fullPath, hits });
    }
  }
}

for (const rootDir of roots) walk(rootDir);

if (problems.length) {
  console.error('Poss?veis textos corrompidos encontrados:\n');
  for (const problem of problems) {
    console.error(`- ${path.relative(process.cwd(), problem.file)} :: ${problem.hits.join(', ')}`);
  }
  process.exit(1);
}

console.log('Nenhum ind?cio de texto corrompido encontrado.');
