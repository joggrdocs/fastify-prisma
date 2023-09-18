#!/usr/bin/env node

const fs = require('node:fs');
const util = require('node:util');
const path = require('node:path');

// Paths
const rootDir = path.resolve(__dirname, '..');

// Promisified Utils
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

// Utils

const getTag = () => {
  if (process.env.TAG) {
    return process.env.TAG.replace('v', '');
  } else {
    throw new Error('No tag found');
  }
};

const preparePackageJsonContents = async () => {
  const packageJsonStringified = await readFile(
    path.resolve(rootDir, 'package.json'),
    'utf8'
  );
  const packageLockJsonStringified = await readFile(
    path.resolve(rootDir, 'package-lock.json'),
    'utf8'
  );

  const packageJson = JSON.parse(packageJsonStringified);
  const packageLockJson = JSON.parse(packageLockJsonStringified);

  // Get the version from the tag
  const version = getTag();

  const packageJsonBuilt = {
    ...packageJson,
    version
  };

  return {
    packageLockJson: {
      ...packageLockJson,
      version,
      packages: {
        '': packageJsonBuilt
      }
    },
    packageJson: packageJsonBuilt
  };
};

const writePackageJson = async ({ packageJson, packageLockJson }) => {
  const packageJsonStringified = JSON.stringify(packageJson, null, 2);
  const packageLockJsonStringified = JSON.stringify(packageLockJson, null, 2);

  await writeFile(
    path.resolve(rootDir, 'package.json'),
    packageJsonStringified
  );
  await writeFile(
    path.resolve(rootDir, 'package-lock.json'),
    packageLockJsonStringified
  );
};

// Main

const updateTheVersion = async () => {
  const packageJsonContents = await preparePackageJsonContents();
  await writePackageJson(packageJsonContents);
};

updateTheVersion()
  .then(() => console.log('⬆️ Packaged version incremented'))
  .catch(err => {
    console.error(`Failed to increment: ${err.message}`);
    process.exit(1);
  });
