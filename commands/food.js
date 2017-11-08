'use strict';

const channels = {};

const SESSION_TTL = 5 * 24 * 60 * 60 * 1000;

const START_USAGE = "There is no active food order.  To start one:\n`/food @person1 @person2 @person3 https://restaurant.example.com/menu`";

function uniq(arr) {
  const seen = {};
  return arr.filter(x => {
    if (seen[x]) return false;
    seen[x] = true;
    return true;
  });
}

function ordersMsg(state, user_id) {
  let msg =
    `${state.orders.length}/${state.requested.length} orders complete:\n`;
  state.orders.forEach(order => {
    msg += `* @${order.user_name} ${order.order}\n`;
  });
  if (!state.orders.some(o => o.user_id === user_id)) {
    msg += 'To add your order, `/food blah blah blah`';
  }
  if (state.orders.length === state.requested.length) {
    msg += '\nAll orders placed.  To clear this session, `/food done`';
  } else {
    msg += `\nRestaurant is: ${state.restaurant}`;
  }
  return msg;
}

module.exports = ({ channel_id, text, user_id, user_name }, res) => {

  function ephemeral(msg) {
    res.json({ response_type: 'ephemeral', text: msg });
  }

  function inChannel(msg) {
    res.json({ response_type: 'in_channel', text: msg });
  }

  let state = channels[channel_id];

  if (text === '') {
    if (state) {
      ephemeral(ordersMsg(state, user_id));
    } else {
      ephemeral(START_USAGE);
    }
  } else if (text === 'done') {
    delete channels[channel_id];
    ephemeral('Order session cleared.');
  } else if (text === 'debug') {
    ephemeral(`\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`\n`);
  } else {
    if (!state || state.created_at < (Date.now() - SESSION_TTL)) {
      const m = text.match(/^((?:@\S+\s+)+)(\S.+)/);
      if (!m) {
        ephemeral(START_USAGE);
      } else {
        const [requested, restaurant] = m.slice(1);
        state = channels[channel_id] = {
          restaurant,
          created_at: Date.now(),
          requested: uniq(requested.replace(/@/g, '').trim().split(/\s+/)),
          orders: [],
        };
        inChannel(`Food orders requested from ${requested}.\nRestaurant is: ${restaurant}\nTo place your order: \`/food blah blah blah\``);
      }
    } else {
      if (state.requested.indexOf(user_name) === -1) {
        state.requested.push(user_name);
      }
      const order = state.orders.filter(o => o.user_id === user_id)[0];
      if (order) {
        order.order = text;
        inChannel(`Updated order for @${user_name} to "${text}"`);
      } else {
        state.orders.push({ user_name, user_id, order: text });
        let msg = `Recorded order for @${user_name} of "${text}"`;
        if (state.orders.length === state.requested.length) {
          msg += `\n${ordersMsg(state, user_id)}`;
        }
        inChannel(msg);
      }
    }
  }
};
