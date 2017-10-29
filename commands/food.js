'use strict';

module.exports = (body, res) => {
  res.json({
    response_type: 'ephemeral',
    text: `Hi, ${body.username}, this worked. :tada:`,
  });
};
