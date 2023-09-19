#!/usr/bin/env node

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');
const childProcess = require('node:child_process');

// Paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Promisified Utils
const writeFile = util.promisify(fs.writeFile);
const exec = util.promisify(childProcess.exec);

// Utils
// ---

const copyCoreFiles = async files => {
  await Promise.all(
    files.map(async ({ src, dest }) => {
      exec(`cp -r ${src} ${dest}`);
    })
  );
};

const createNote = async () => {
  const note = `
This contents of this package are transpiled & generated and not representative of the source code.

To view the source code, please visit https://github.com/joggrdocs/fastify-prisma
`.trim();

  await writeFile(path.resolve(distDir, 'to_whom_it_may_concern.txt'), note);
};

// Main
// ---

const prepareThePackage = async () => {
  await exec('npm run build', {
    cwd: rootDir
  });

  // Copy the core files
  await copyCoreFiles([
    {
      src: path.resolve(rootDir, 'package.json'),
      dest: path.resolve(distDir, 'package.json')
    },
    {
      src: path.resolve(rootDir, 'package-lock.json'),
      dest: path.resolve(distDir, 'package-lock.json')
    },
    {
      src: path.resolve(rootDir, 'README.md'),
      dest: path.resolve(distDir, 'README.md')
    },
    {
      src: path.resolve(rootDir, 'LICENSE'),
      dest: path.resolve(distDir, 'LICENSE')
    }
  ]);

  // Note to anyone poking around in the node_modules folder
  await createNote();
};

prepareThePackage()
  .then(() => console.log('📦 Packaged & ready to publish'))
  .catch(err => {
    console.error(`Failed to package: ${err.message}`);
    process.exit(1);
  });
