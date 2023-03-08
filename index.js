const express = require('express');
const bodyParser = require('body-parser');
const issue = require('./middlewares/issue');
const server = express();

server.use(bodyParser.json({limit: '5mb'}));
const port = 3000;

server.post('/issue', issue);

server.listen(port, () => console.log(`Cert-issuer-node-wrapper app listening at http://localhost:${port}`));
