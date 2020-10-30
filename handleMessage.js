/***
*
* Responsible for negotiating messages between two clients
*
****/

var authorManager = require("../../src/node/db/AuthorManager"),
padMessageHandler = require("../../src/node/handler/PadMessageHandler"),
            async = require('../../src/node_modules/async');

var wordnet = require('wordnet');

/* 
* Handle incoming messages from clients
*/
exports.handleMessage = function(hook_name, context, callback){
  // Firstly ignore any request that aren't about chat
  var isDefineMessage = false;
  if(context){
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){ 
          if(context.message.data.type){
            if(context.message.data.type === 'define'){
              isDefineMessage = true;
            }
          }
        }
      }
    }
  }
  if(!isDefineMessage){
    callback(false);
  }

  var message = context.message.data;
  /***
    What's available in a message?
     * action -- The action IE chatPosition
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * message -- the actual message
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if(message.action === 'sendDefineMessage'){
    wordnet.lookup(message.message, function(err, definitions) {   

      if(err) return;
      var msg = {
        type: "COLLABROOM",
        data: { 
          type: "CUSTOM",
          payload: {
            action: "recieveDefineMessage",
            authorId: message.myAuthorId,
            padId: message.padId,
            message: definitions
          }
        }
      };
      context.client.json.send(msg);
    });
  }

  if(isDefineMessage === true){
    callback([null]);
  }else{
    callback(true);
  }
}

