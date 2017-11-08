'use strict';

module.exports = ({ text }, res) => {
  res.json({
    response_type: 'in_channel',
    text: text.replace(/^/gm, '> ').replace(/> $/, ''),
  });
};
