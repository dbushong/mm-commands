'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const commands = {
  food: require('./commands/food'),
  quote: require('./commands/quote'),
  tfc: require('./commands/tfc'),
  math: require('./commands/math'),
  cow: require('./commands/cow'),
  figlet: require('./commands/figlet'),
};

const tokens = require('./tokens');

function httpErr(res, code, msg) {
  res.status = code;
  res.setHeader('Content-Type', 'text/plain');
  res.end(msg);
}

function cmdErr(res, err) {
  console.error(err);
  res.json({
    response_type: 'ephemeral',
    text: `⚠ ${err.message}`,
  });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use((err, req, res, next) => { cmdErr(res, err); });

app.all('/', (req, res, next) => {
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

  const token = tokens[m[1]];
  if (body.token !== token) {
    if (token) {
      console.log(`no token for command ${command} - allowing anyway`);
    } else {
      httpErr(res, 403, 'bad token');
      return;
    }
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    command(body, res, next);
  } catch (err) {
    cmdErr(res, err);
  }
});

const port = Number(process.env.PORT || 0xf00d);
app.listen(port);
console.log(`Listening on http://localhost:${port}`);
