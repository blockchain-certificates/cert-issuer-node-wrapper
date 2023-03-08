# cert-issuer-node-wrapper

A javascript wrapper to execute cert-issuer issuance, mainly intended to work with w3c/vc-test-suite.

It will take a list of file paths, copy them to the working directory of cert-issuer, run the issuance and print in the
stdout the signed certificates if successful (again, the initial intent is to plug with vc-test-suite).

## Commands

### Start Server

`npm start`

Will run on port 3000.

### Call the server for issuance

`node callIssue.js`

It will expect at minimum to pass a `--files` argument as follows:

```
  node callIssue.js --files /path/to/file
```

A comma separated list, with no space, can be provided to specify multiple files to issue:

```
  node callIssue.js --files /path/to/file,/path/to/another/file
```

### Other options

`--help`: display help

`--issuer_path`: relative path to the cert-issuer directory (default '../cert-issuer')
