const express = require('express');
const bodyParser = require('body-parser');
const issue = require('./middlewares/issue');
const server = express();
const port = require('./port');

server.use(bodyParser.json({limit: '5mb'}));

server.post('/issue', issue);

server.listen(port, () => console.log(`Cert-issuer-node-wrapper app listening at http://localhost:${port}`));
