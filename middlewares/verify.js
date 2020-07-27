const { spawn } = require('child_process');

function verify (req) {
  return new Promise((resolve, reject) => {
    let stdout = [];
    let stderr = [];
    const verificationProcess = spawn('python3', ['cert_issuer', '-c', 'conf.ini']);
    verificationProcess.stdout.pipe(process.stdout);

    verificationProcess.on('error', err => reject(new Error(err)));
    verificationProcess.stdout.on('error', err => reject(new Error(err)));
    verificationProcess.stderr.on('error', err => reject(new Error(err)));
    verificationProcess.stdin.on('error', err => reject(new Error(err)));

    verificationProcess.stdout.on('data', data => stdout.push(data));
    verificationProcess.stderr.on('data', data => stderr.push(data));

    verificationProcess.stdin.end('');

    verificationProcess.on('close', code => {
      stdout = Buffer.concat(stdout);
      stderr = Buffer.concat(stderr);

      if (code === 0) {
        return resolve({ stdout, stderr });
      }

      let error = new Error(`command exited with code: ${code}\n\n ${stdout}\n\n ${stderr}`);

      // emulate actual Child Process Errors
      error.path = 'python3';
      error.syscall = 'spawn python3';
      error.spawnargs = ['cert_issuer', '-c', 'conf.ini'];

      return reject(error)
    })
  });
}


module.exports = verify;
