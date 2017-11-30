'use strict';

const cowsay = require('cowsay');

module.exports = ({ text }, res) => {
  const m = text.match(/^\s*(say|think)\s+(.+)/);
  if (!m) {
    res.json({
      response_type: 'ephemeral',
      text: 'Must use as `/cow say <text>` or `/cow think <text>`',
    });
    return;
  }
  const [, action, msg] = m;

  res.json({
    response_type: 'in_channel',
    text: `\`\`\`\n${cowsay[action]({ text: msg })}\n\`\`\``,
  });
};
