'use strict';

module.exports = ({ user_name, text }, res) => {
  res.json({
    response_type: 'in_channel',
    text: text.replace(/^/gm, '> ').replace(/> $/, ''),
  });
};
