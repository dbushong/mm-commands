'use strict';

const flip = require('flip');

module.exports = ({ text }, res) => {
  const what = /\S/.test(text) ? flip(text) : '┻━┻';
  res.json({ response_type: 'in_channel', text: `(╯°□°）╯︵ ${what}` });
};
