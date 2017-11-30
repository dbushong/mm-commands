'use strict';

const figlet = require('figlet');

module.exports = ({ text }, res, next) => {
  if (/^font\s+list\s*$/.test(text)) {
    figlet.fonts((err, fonts) => {
      if (err) {
        next(err);
        return;
      }
      res.json({
        response_type: 'ephemeral',
        text: `Available fonts: ${fonts.join(', ')}`,
      });
    });
  }

  const m = text.match(/^(?:font\s+(?:"([^"]+)"|(\S+))\s+)?(.+)/);

  if (!m) {
    throw new Error('usage: `/figlet font list` or `/figlet font Poison some message` or `/figlet font "S Blood" some message`');
  }

  const [, quotedFont, oneWordFont, msg] = m;

  const opts = {};
  const font = quotedFont || oneWordFont;
  if (font) opts.font = font;

  figlet.text(msg, opts, (err, figText) => {
    if (err) {
      next(err);
      return;
    }
    res.json({
      response_type: 'in_channel',
      text: `\`\`\`\n${figText}\n\`\`\``,
    });
  });
};
