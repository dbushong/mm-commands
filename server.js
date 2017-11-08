'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const commands = {
  food: require('./commands/food'),
  quote: require('./commands/quote'),
  tfc: require('./commands/tfc'),
};

const tokens = require('./tokens');

function httpErr(res, code, msg) {
  res.status = code;
  res.setHeader('Content-Type', 'text/plain');
  res.end(msg);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.all('/', (req, res) => {
  const body = req.method === 'POST' ? req.body : req.query;

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

  if (body.token !== tokens[m[1]]) {
    httpErr(res, 403, 'bad token');
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  command(body, res);
});

const port = Number(process.env.PORT || 0xf00d);
app.listen(port);
console.log(`Listening on http://localhost:${port}`);
