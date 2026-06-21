'use strict';

// `wordnet` is a server-only package (it reads the WordNet database off disk).
// It MUST NOT be required at module top level: Etherpad's client bundler pulls
// plugin hook modules into the browser bundle, and evaluating wordnet's module
// body in the browser silently hangs the editor bootstrap (ace_outer is never
// created, no error is thrown). Requiring it lazily inside the hook keeps the
// module body from ever running client-side while still working on the server.
let wordnet = null;
let initPromise = null;
const ensureInit = () => {
  if (!wordnet) wordnet = require('wordnet');
  if (!initPromise) initPromise = wordnet.init();
  return initPromise;
};

const sendDefinition = (context, definitions) => {
  const payload = context.message.data.payload;
  context.socket.emit('message', {
    type: 'COLLABROOM',
    data: {
      type: 'CUSTOM',
      payload: {
        action: 'recieveDefineMessage',
        authorId: payload.myAuthorId,
        padId: payload.padId,
        message: definitions,
      },
    },
  });
};

exports.handleMessage = async (hookName, context) => {
  const payload = context?.message?.data?.payload;
  if (!(context?.message?.type === 'COLLABROOM' &&
        context.message.data?.type === 'CLIENT_MESSAGE' &&
        payload?.type === 'define' &&
        payload?.action === 'sendDefineMessage')) {
    return;
  }
  try {
    await ensureInit();
    const definitions = await wordnet.lookup(payload.message, true);
    sendDefinition(context, definitions);
  } catch (err) {
    // wordnet 2.x rejects when the word isn't found; surface a "no
    // match" payload to the client instead of crashing the request.
    sendDefinition(context, null);
  }
  return [null];
};
