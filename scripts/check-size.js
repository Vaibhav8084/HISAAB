const fs = require('fs');
const path = require('path');

function getDirSize(dirPath, excludeDirs = ['node_modules', '.git', '.next']) {
  let totalSize = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (excludeDirs.includes(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += getDirSize(fullPath, excludeDirs);
    } else if (entry.isFile()) {
      totalSize += fs.statSync(fullPath).size;
    }
  }
  return totalSize;
}

const rootDir = path.resolve(__dirname, '..');
const sizeInBytes = getDirSize(rootDir);
const sizeInMB = sizeInBytes / (1024 * 1024);

console.log(`Repository size (excluding node_modules, .git, .next): ${sizeInMB.toFixed(2)} MB (${sizeInBytes} bytes)`);

if (sizeInMB > 8.0) {
  console.error(`ERROR: Repository exceeds 8 MB limit! Actual: ${sizeInMB.toFixed(2)} MB`);
  process.exit(1);
} else {
  console.log(`✓ Repository size is well under limit: ${sizeInMB.toFixed(2)} MB < 8 MB`);
}
