const { spawn } = require('child_process');

function verify (req, res) {
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
      stdout = stdout.join('').trim();
      stderr = stderr.join('').trim();

      if (code === 0) {
        console.log(stdout, stderr);
        console.log('success');
        res.send({ success: true });
        return resolve({ successResolve: true });
      }

      let error = new Error(`command exited with code: ${code}\n\n ${stdout}\n\n ${stderr}`);

      // emulate actual Child Process Errors
      error.path = 'python3';
      error.syscall = 'spawn python3';
      error.spawnargs = ['cert_issuer', '-c', 'conf.ini'];

      res.send({
        success: false,
        error
      });
      return reject(error);
    })
  });
}


module.exports = verify;
