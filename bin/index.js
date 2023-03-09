#!/usr/bin/env node

const { exec } = require('child_process');

const command = process.argv[2];

if (command === 'help') {
  console.log(`
  Main invocation: blockcerts-issuer
  Available commands:
    - help: show help
    - start: start proxy server to cert-issuer
    - stop: stop server
  `)
  return;
}

if (command === 'start') {
  console.log('start command', process.env.PWD, process.cwd());
  exec('node ../index.js', (err) => {
    console.log(err);
  });
  return;
}

if (command === 'stop') {
  console.log('stop command', process.env.PWD, process.cwd());
  exec('node ./kill-server.js', (err) => {
    console.log(err);
  });
  return;
}

console.log('blockcerts-issuer unknown command', command, 'run `blockcerts-issuer help` for a list of available commands');


