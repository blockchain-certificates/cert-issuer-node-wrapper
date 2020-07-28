const fetch = require('node-fetch');
const fs = require('fs');

async function readData (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  })
}

async function callVerify () {
  const certificate = await readData(process.argv[2]);
  const res = await fetch('http://localhost:3000/verify', {
    method: 'POST',
    body: JSON.stringify({
      certificate
    }),
    headers: {'Content-Type': 'application/json'}
  }).then(res => {
    const decoded = res.json();
    return decoded;
  }).catch (err => {
    throw new Error(err);
  });
  if (res.certificate) {
    console.log(JSON.stringify(res.certificate));
    return res.certificate;
  }

  console.error(res);
  throw new Error('No certificate returned');
}

callVerify();
