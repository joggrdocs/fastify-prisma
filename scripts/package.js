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
const readFile = util.promisify(fs.readFile);
const exec = util.promisify(childProcess.exec);

// Utils

const preparePackageJson = async () => {
  const packageJsonStringified = await readFile(
    path.resolve(rootDir, 'package.json'),
    'utf8'
  );

  // Extract the fields we want to manipulate & leave the rest as is (e.g. devDependencies)
  const {
    devDependencies: _devDependencies,
    scripts: _scripts,
    main: _main,
    ...packageJson
  } = JSON.parse(packageJsonStringified);

  // Get the version from the tag
  const version = process.env.TAG.replace('v', '');

  // Prepare the scripts
  const scripts = {};

  return {
    ...packageJson,
    scripts,
    version,
    main: 'index.js',
    dependencies: packageJson.dependencies
  };
};

const writePackageJson = async packageJson => {
  const packageJsonStringified = JSON.stringify(packageJson, null, 2);
  await writeFile(
    path.resolve(distDir, 'package.json'),
    packageJsonStringified
  );
};

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

  await writeFile(path.resolve(distDir, 'to_whom_it_may_concern.txt'), note);
};

// Main

const prepareThePackage = async () => {
  await exec('npm run build', {
    cwd: rootDir
  });

  // Prepare the package.json
  const packageJson = await preparePackageJson();
  await writePackageJson(packageJson);

  // Copy the core files
  await copyCoreFiles([
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
  .catch(err => console.error(`Failed to package: ${err.message}`));
