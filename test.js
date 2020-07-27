const fetch = require('node-fetch');

async function callVerify () {
  const res = await fetch('http://localhost:3000/verify', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {'Content-Type': 'application/json'}
  }).then(res => {
    console.log('res', res);
    const decoded = res.json();
    return decoded;
  });
  console.log(res);
}

callVerify();
