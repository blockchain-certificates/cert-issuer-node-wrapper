const express = require('express');
const verify = require('./middlewares/verify');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/verify', verify);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
