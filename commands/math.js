'use strict';

const math = require('mathjs');

module.exports = ({ text, user_name }, res) => {
  let response_type = 'ephemeral';
  let mathPfx = '';
  let addrPfx = '';

  const m = text.match(/^say\s+(.*)/);
  if (m) {
    response_type = 'in_channel';
    text = m[1];
    mathPfx = `${text} = `;
    addrPfx = `@${user_name} `;
  }

  try {
    res.json({
      response_type,
      text: `${addrPfx}\`${mathPfx}${math.eval(text)}\``,
    });
  } catch (err) {
    res.json({
      response_type: 'ephemeral',
      text: `⚠ ${err.message}`,
    });
  }
};
