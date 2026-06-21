'use strict';

// `wordnet` is a server-only package (it reads the WordNet database off disk).
// It MUST NOT be required at module top level: Etherpad's client bundler pulls
// plugin hook modules into the browser bundle, and evaluating wordnet's module
// body in the browser silently hangs the editor bootstrap — the ace_outer
// iframe is never created and no error is thrown, so every pad (and the whole
// frontend test suite) times out. Requiring it lazily inside the hook keeps the
// module body from ever running client-side while still working on the server.
let wordnet = null;
let initPromise = null;
const ensureInit = () => {
  if (!wordnet) wordnet = require('wordnet');
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
    // Not our message — return nothing so the message keeps flowing. Returning
    // `[null]` here would tell core to DROP every non-define message (typing,
    // cursor moves, …), silently breaking the pad.
    return;
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
