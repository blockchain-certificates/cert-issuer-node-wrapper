#!/usr/bin/env node

const { exec, spawn } = require('child_process');
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
  console.log('set cwd at', path.join(__dirname, '../../..'));
  console.log('execution dirname', __dirname);
  const serverProcess = spawn('node', [path.join(__dirname, '../index.js')], {
    cwd: path.join(__dirname, '../../..')
  });
  let stdoutChunks = [], stderrChunks = [];

  serverProcess.stdout.on('data', (data) => {
    stdoutChunks = stdoutChunks.concat(data);
  });
  serverProcess.stdout.on('end', () => {
    const stdoutContent = Buffer.concat(stdoutChunks).toString();
    console.log('cert-issuer-node-wrapper stdout:', stdoutContent);
  });

  serverProcess.stderr.on('data', (data) => {
    stderrChunks = stderrChunks.concat(data);
  });
  serverProcess.stderr.on('end', () => {
    const stderrContent = Buffer.concat(stderrChunks).toString();
    console.log('cert-issuer-node-wrapper ERROR:', stderrContent);
  });
  serverProcess.on('error', console.log);
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


