const express = require('express');
const bodyParser = require('body-parser');
const issue = require('./cert-issuer-node-wrapper/middlewares/issue');
const server = express();

server.use(bodyParser.json({limit: '5mb'}));
const port = 3000;

server.post('/issue', issue);

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
