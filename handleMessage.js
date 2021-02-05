'use strict';

/** *
*
* Responsible for negotiating messages between two clients
*
****/

const wordnet = require('wordnet');

/*
* Handle incoming messages from clients
*/
exports.handleMessage = (hookName, context, callback) => {
  // Firstly ignore any request that aren't about chat
  if (context &&
    context.message &&
    context.message.data &&
    context.message.data.type &&
    context.message.data.action &&
    context.message.data.action === 'sendDefineMessage') {
    wordnet.lookup(context.message.data.message, (err, definitions) => {
      const msg = {
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
      };
      context.client.json.send(msg);
      callback([null]);
    });
  } else {
    callback(true);
  }
};
