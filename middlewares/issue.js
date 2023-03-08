const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function saveFileToUnsignedCertificates (data, index) {
  const targetPath = path.join(__dirname, '..', '../data/unsigned_certificates', `sample-${index}.json`);
  fs.writeFileSync(targetPath, JSON.stringify(data));
}

async function getSignedCertificates (count) {
  let targetPaths = [];
  // console.log(`retrieving ${count} certificates after issuance`);

  for (let i = 0; i < count; i++) {
    targetPaths.push(path.join(__dirname, '..', '../data/blockchain_certificates', `sample-${i}.json`));
  }

  // console.log('certificates are located at', targetPaths);

  return new Promise((resolve, reject) => {
    const certificates = targetPaths.map(path => fs.readFileSync(path, 'utf8'));
    resolve(certificates);
  });
}

function issue (req, res) {
  const certs = req.body.certificates;
  // console.log('received request to issue', certs);
  const certificateCount = certs.length;

  certs.forEach((cert, index) => saveFileToUnsignedCertificates(cert, index));

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

    verificationProcess.on('close', async code => {
      stdout = stdout.join('').trim();
      stderr = stderr.join('').trim();
      if (code === 0) {
        const certificates = await getSignedCertificates(certificateCount);
        res.send({
          success: true,
          certificates
        });
        return resolve({ successResolve: true });
      }

      let error = new Error(`command exited with code: ${code}\n\n ${stdout}\n\n ${stderr}`);

      // emulate actual Child Process Errors
      error.path = 'python3';
      error.syscall = 'spawn python3';
      error.spawnargs = ['cert_issuer', '-c', 'conf.ini'];

      res.send({
        success: false,
        error,
        stderr
      });
      return reject(error);
    })
  });
}


module.exports = issue;
