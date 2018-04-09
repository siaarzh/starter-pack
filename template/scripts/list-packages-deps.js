const { readdirSync, statSync, existsSync } = require('fs');
const { resolve, join } = require('path');

const DIR = resolve(__dirname, '..', 'packages');

const packages = readdirSync(DIR).filter(filename => {
  return statSync(join(DIR, filename)).isDirectory();
});

const allDeps = packages.reduce((accum, pkg) => {
  let pkgDeps = [];
  const packagePath = join(DIR, pkg, 'package.json');
  if (existsSync(packagePath)) {
    pkgDeps = Object.keys(require(packagePath).dependencies);
  }
  accum = [].concat(accum, pkgDeps);
  return accum;
}, []);

console.log(`yarn add ${allDeps.join(' ')}`);
