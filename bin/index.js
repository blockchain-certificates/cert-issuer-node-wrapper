#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

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
  exec(`node ${path.join(__dirname, '../index.js')}`, {
    cwd: path.join(__dirname, '..')
  }, (err) => {
    if (err){
      console.error(err);
    }
  });
  return;
}

if (command === 'stop') {
  exec(`node ${path.join(__dirname, './kill-server.js')}`, {
    cwd: path.join(__dirname)
  }, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return;
}

console.log('blockcerts-issuer unknown command', command, 'run `blockcerts-issuer help` for a list of available commands');


