const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

const packageRegex = /("version": *)"((?:[0-9]+\.?){3})"(,)/;
const configRegex = /(widget *id="com\.mirage\.mirageDT" *version=)"((?:[0-9]+\.?){3})"/;

const args = process.argv.slice(2);
const type = args[0];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const [packageContent, packageVersion] = parsePackage();
const [configContent, configVersion] = parseConfig();

if (configVersion !== packageVersion) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Version mismatch between package.json and config.xml (${packageVersion} !== ${configVersion})`,
  );
  process.exit(1);
}

let [major, minor, patch] = configVersion.split('.').map((v) => +v);

if (type === 'major') {
  major++;
  minor = 0;
  patch = 0;
} else if (type === 'minor') {
  minor++;
  patch = 0;
} else if (type === 'patch') patch++;
else {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'Valid version changes are major, minor, patch',
  );
  process.exit(1);
}

const newVersion = `${major}.${minor}.${patch}`;

fs.writeFileSync(
  'package.json',
  packageContent.replace(packageRegex, `$1"${newVersion}"$3`),
);

fs.writeFileSync(
  'config.xml',
  configContent.replace(configRegex, `$1"${newVersion}"`),
);

console.log(`Updated version from ${configVersion} to ${newVersion}`);
console.log(`Creating git release for new version ...`);

exec(
  `git tag -a ${newVersion} "v${newVersion}"`,
  (err) =>
    !!err && console.error('\x1b[31m%s\x1b[0m', 'Unable to create git tag'),
);

exec(
  `git push origin "v${newVersion}"`,
  (err) =>
    !!err && console.error('\x1b[31m%s\x1b[0m', 'Unable to push git tag to origin'),
);

process.exit(0);

function parsePackage() {
  const content = fs.readFileSync('package.json').toString();
  const version = (content.match(packageRegex) || [])[2];
  if (!version) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Unable to find version in package.json',
    );
    process.exit(1);
  }
  return [content, version];
}

function parseConfig() {
  const content = fs.readFileSync('config.xml').toString();
  const version = (content.match(configRegex) || [])[2];
  if (!version) {
    console.error('\x1b[31m%s\x1b[0m', 'Unable to find version in config.xml');
    process.exit(1);
  }
  return [content, version];
}
