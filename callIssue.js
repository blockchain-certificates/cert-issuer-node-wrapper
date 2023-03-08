const fetch = require('node-fetch');
const fs = require('fs');

async function readData (paths) {
  return new Promise((resolve, reject) => {
    const certificates = paths.map(path => JSON.parse(fs.readFileSync(path, 'utf8')));
    resolve(certificates);
  })
}

function getArgumentIndex (arg) {
  return process.argv.findIndex(argv => argv === arg);
}

function getFilesToIssueFromArgv () {
  const argIndex = getArgumentIndex('--files');
  if (argIndex === -1) {
    return;
  }
  const files = process.argv[argIndex + 1]?.split(',');
  return files;
}

function getIssuerPathFromArgv () {
  const argIndex = getArgumentIndex('--issuer_path');
  if (argIndex === -1) {
    return;
  }
  const issuerPath = process.argv[argIndex + 1];
  return issuerPath;
}

function getHelpFromArgv () {
  const argIndex = getArgumentIndex('--help');
  return argIndex !== -1;
}

async function callIssue () {
  const isHelp = getHelpFromArgv();
  if (isHelp) {
    console.log(`use a space separated command list, ie: --command value
    
    Argument list:
      
      --help: display this text
      
      --issuer_path: relative path to the cert-issuer directory (default '../cert-issuer')
      
      --files: absolute path to file(s) to issue, a comma separated (no space) list in the case of multiple files
    `);
    return;
  }
  const filePaths = getFilesToIssueFromArgv();
  if (!filePaths) {
    console.log('No certificates passed for issuance, use --files /path/to/file[,/path/to/another/file] syntax.');
    return;
  }
  const issuerPath = getIssuerPathFromArgv();
  const certificates = await readData(filePaths);
  // console.log(`sending ${certificates.length} certificates to issuance`, certificates);
  const res = await fetch('http://localhost:3000/issue', {
    method: 'POST',
    body: JSON.stringify({
      certificates,
      ...issuerPath && {
        issuerPath
      }
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
