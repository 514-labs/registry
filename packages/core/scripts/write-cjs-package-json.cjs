const fs = require('fs');
const path = require('path');

const cjsDir = path.join(__dirname, '..', 'dist', 'cjs');

/**
 * Write a package.json into dist/cjs so Node treats files as CommonJS when required.
 */
function main() {
  if (!fs.existsSync(cjsDir)) return;
  const pkgPath = path.join(cjsDir, 'package.json');
  const pkg = { type: 'commonjs' };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

main();

