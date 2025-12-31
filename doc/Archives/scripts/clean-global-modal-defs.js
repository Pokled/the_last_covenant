// ...new file...
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const readAllJs = (dir) => {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...readAllJs(full));
    } else if (e.isFile() && full.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
};

const patterns = [
  /function\s+showModal\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g,
  /function\s+closeModal\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g,
  /function\s+ensureModalGlobal\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g,
  /(const|let|var)\s+showModal\s*=\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\});?/g,
  /(const|let|var)\s+closeModal\s*=\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\});?/g,
  /(const|let|var)\s+ensureModalGlobal\s*=\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|\([^)]*\)\s*=>\s*\{[\s\S]*?\});?/g,
  /window\.showModal\s*=\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|[^;]+;)/g,
  /window\.closeModal\s*=\s*(function\s*\([^)]*\)\s*\{[\s\S]*?\}|[^;]+;)/g,
];

const files = readAllJs(root);
let totalRemoved = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // find class Game boundaries to avoid deleting methods inside class
  const classIdx = content.indexOf('class Game');
  let classStart = -1, classEnd = -1;
  if (classIdx !== -1) {
    const openBraceIdx = content.indexOf('{', classIdx);
    if (openBraceIdx !== -1) {
      classStart = openBraceIdx;
      // find matching closing brace
      let depth = 1;
      for (let i = openBraceIdx + 1; i < content.length; i++) {
        if (content[i] === '{') depth++;
        else if (content[i] === '}') {
          depth--;
          if (depth === 0) {
            classEnd = i;
            break;
          }
        }
      }
    }
  }

  let changed = false;

  for (const re of patterns) {
    re.lastIndex = 0;
    let match;
    const matches = [];
    while ((match = re.exec(content)) !== null) {
      const start = match.index;
      const end = re.lastIndex;
      // if inside class, skip
      if (classStart !== -1 && start > classStart && end < classEnd) {
        continue;
      }
      matches.push({ start, end });
    }
    // remove matches from end -> start to keep indices valid
    if (matches.length) {
      for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        content = content.slice(0, m.start) + content.slice(m.end);
        changed = true;
        totalRemoved++;
      }
    }
  }

  if (changed && content !== original) {
    fs.copyFileSync(file, file + '.bak', fs.constants.COPYFILE_EXCL);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned: ${file} (backup: ${path.basename(file)}.bak)`);
  }
}

console.log(`Done. Removed ${totalRemoved} global modal definitions (if any).`);
// ...new file...