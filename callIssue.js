const fetch = require('node-fetch');
const fs = require('fs');

async function readData (paths) {
  return new Promise((resolve, reject) => {
    const certificates = paths.map(path => JSON.parse(fs.readFileSync(path, 'utf8')));
    resolve(certificates);
  })
}

async function callIssue () {
  let filePaths = process.argv[2]?.split(',');
  if (!filePaths) {
    console.log('No certificates passed for issuance');
    return;
  }
  const certificates = await readData(filePaths);
  // console.log(`sending ${certificates.length} certificates to issuance`, certificates);
  const res = await fetch('http://localhost:3000/issue', {
    method: 'POST',
    body: JSON.stringify({
      certificates
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(res => {
    const decoded = res.json();
    return decoded;
  }).catch (err => {
    // throw new Error(err);
    console.error('Error:', err);
  });
  if (res.certificates) {
    const response = res.certificates.map(signedCertificate => JSON.parse(signedCertificate));
    console.log(JSON.stringify(response, null, 2));
    return response;
  }

  console.error(res);
  throw new Error('No certificate returned');
}

callIssue();
