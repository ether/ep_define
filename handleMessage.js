'use strict';

const wordnet = require('wordnet');

let initPromise = null;
const ensureInit = () => {
  if (!initPromise) initPromise = wordnet.init();
  return initPromise;
};

const sendDefinition = (context, definitions) => {
  context.client.json.send({
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        action: 'recieveDefineMessage',
        authorId: context.message.data.message.myAuthorId,
        padId: context.message.data.message.padId,
        message: definitions,
      },
    },
  });
};

exports.handleMessage = async (hookName, context) => {
  if (!(context && context.message && context.message.data &&
        context.message.data.type && context.message.data.action === 'sendDefineMessage')) {
    return [null];
  }
  try {
    await ensureInit();
    const definitions = await wordnet.lookup(context.message.data.message, true);
    sendDefinition(context, definitions);
  } catch (err) {
    // wordnet 2.x rejects when the word isn't found; surface a "no
    // match" payload to the client instead of crashing the request.
    sendDefinition(context, null);
  }
  return [null];
};
