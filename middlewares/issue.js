const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ISSUER_PATH = '../cert-issuer';
const UNSIGNED_CERTIFICATES_DIR = './data/unsigned_certificates';
const SIGNED_CERTIFICATES_DIR = './data/blockchain_certificates';

function getUnsignedCertificatesPath (i) {
  return path.join(__dirname, '..', ISSUER_PATH, UNSIGNED_CERTIFICATES_DIR, getFileName(i));
}

function getSignedCertificatesPath (i) {
  return path.join(__dirname, '..', ISSUER_PATH, SIGNED_CERTIFICATES_DIR, getFileName(i));
}

function getFileName (i) {
  return `sample-${i}.json`;
}

function saveFileToUnsignedCertificates (data, i) {
  const targetPath = getUnsignedCertificatesPath(i);
  fs.writeFileSync(targetPath, JSON.stringify(data));
}

async function getSignedCertificates (count) {
  let targetPaths = [];
  // console.log(`retrieving ${count} certificates after issuance`);

  for (let i = 0; i < count; i++) {
    targetPaths.push(getSignedCertificatesPath(i));
  }

  // console.log('certificates are located at', targetPaths);

  return new Promise((resolve, reject) => {
    const certificates = targetPaths.map(path => fs.readFileSync(path, 'utf8'));
    resolve(certificates);
  });
}

function deleteTestCertificates (count) {
  const targetPaths = [];
  for (let i = 0; i < count; i++) {
    targetPaths.push(getUnsignedCertificatesPath(i));
    targetPaths.push(getSignedCertificatesPath(i));
  }
  targetPaths.forEach(path => fs.unlinkSync(path));
}

function issue (req, res) {
  const certs = req.body.certificates;
  // console.log('received request to issue', certs);
  const certificateCount = certs.length;

  certs.forEach((cert, index) => saveFileToUnsignedCertificates(cert, index));

  return new Promise((resolve, reject) => {
    let stdout = [];
    let stderr = [];
    const spawnArgs = [`${ISSUER_PATH}/cert_issuer`, '-c', `${ISSUER_PATH}/conf.ini`]
    const verificationProcess = spawn('python3', spawnArgs, {
      cwd: ISSUER_PATH
    });
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
        deleteTestCertificates(certificateCount);
        return resolve({ successResolve: true });
      }

      let error = new Error(`command exited with code: ${code}\n\n ${stdout}\n\n ${stderr}`);

      // emulate actual Child Process Errors
      error.path = 'python3';
      error.syscall = 'spawn python3';
      error.spawnargs = spawnArgs;

      res.send({
        success: false,
        error,
        stderr
      });
      deleteTestCertificates(certificateCount);
      return reject(error);
    })
  });
}


module.exports = issue;
