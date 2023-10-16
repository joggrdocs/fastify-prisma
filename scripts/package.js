#!/usr/bin/env node

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');
const childProcess = require('node:child_process');

/*
|==========================================================================
| package
|==========================================================================
|
| This script is used to prepare the package for publishing to npm.
|
*/

/*
|------------------
| Paths
|------------------
*/

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

/*
|------------------
| Promisified Node Utils
|------------------
*/

const writeFile = util.promisify(fs.writeFile);
const exec = util.promisify(childProcess.exec);

/*
|------------------
| Utils
|------------------
*/

const copyCoreFiles = async files => {
  await Promise.all(
    files.map(async ({ src, dest }) => {
      exec(`cp -r ${src} ${dest}`);
    })
  );
};

const createNote = async () => {
  const note = `
This contents of this package are generated and not representative of the source code.

To view the source code, please visit https://github.com/joggrdocs/fastify-prisma
`.trim();

  await writeFile(path.resolve(distDir, 'note.txt'), note);
};

const prepareThePackage = async () => {
  await exec('npm run build', {
    cwd: rootDir
  });

  // Copy the core files
  await copyCoreFiles([
    {
      src: path.resolve(rootDir, 'README.md'),
      dest: path.resolve(distDir, 'README.md')
    },
    {
      src: path.resolve(rootDir, 'package.json'),
      dest: path.resolve(distDir, 'package.json')
    },
    {
      src: path.resolve(rootDir, 'package-lock.json'),
      dest: path.resolve(distDir, 'package-lock.json')
    },
    {
      src: path.resolve(rootDir, 'LICENSE'),
      dest: path.resolve(distDir, 'LICENSE')
    }
  ]);

  // Note to anyone poking around in the node_modules folder
  await createNote();
};

/*
|------------------
| Run the script
|------------------
*/

prepareThePackage()
  .then(() => console.log('📦 Packaged & ready to publish'))
  .catch(err => {
    console.error(`Failed to package: ${err.message}`);
    process.exit(1);
  });
