#!/usr/bin/env node

const { exec } = require('child_process');

const command = process.argv[1];

console.log('command', command);
console.log(process.argv);

if (command === 'help') {
  console.log(`
  Main invocation: blockcerts-issuer
  Available commands:
    - help: show help
    - start: start proxy server to cert-issuer
    - stop: stop server
  `)
}

if (command === 'start') {
  exec('node ../index.js');
}

if (command === 'stop') {
  exec('node ./kill-server.js');
}
