'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const commands = {
  food: require('./commands/food'),
};

function httpErr(res, code, msg) {
  res.status = code;
  res.setHeader('Content-Type', 'text/plain');
  res.end(msg);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));

if (!process.env.MM_CMD_TOKEN) {
  throw new Error('Must run with MM_CMD_TOKEN environment variable');
}

app.all('/', (req, res) => {
  const body = req.method === 'POST' ? req.body : req.query;

  if (body.token !== process.env.MM_CMD_TOKEN) {
    httpErr(res, 403, 'bad token');
    return;
  }

  const m = body.command.match(/^\/(\S+)/);
  if (!m) {
    httpErr(res, 400, `bad command: ${body.command}`);
    return;
  }

  const command = commands[m[1]];

  if (!command) {
    httpErr(res, 400, `unhandled command ${m[1]}`);
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  command(body, res);
});

const port = Number(process.env.PORT || 0xf00d);
app.listen(port);
console.log(`Listening on http://localhost:${port}`);
