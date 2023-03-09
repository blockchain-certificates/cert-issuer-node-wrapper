#!/usr/bin/env node

const port = require('../port');
const { exec } = require('child_process');

console.log('killing pid at port', port)
exec(`kill $(lsof -t -i:${port})`);
