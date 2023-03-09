const port = require('../port');
const { exec } = require('child_process');

console.log('killing pid at port', port)
exec(`kill -9 $(lsof -t -i:${port})`);
