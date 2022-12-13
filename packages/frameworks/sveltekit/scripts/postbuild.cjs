// After build, copy the files in ./package to the root directory, excluding the package.json file.
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');
await fs.cp(path.join(root, 'package'), root, {
  // don't copy the package.json file from package
  filter: (src) => !src.includes('package.json')
});
await fs.remove(path.join(root, 'package'));