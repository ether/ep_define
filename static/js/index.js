'use strict';

exports.handleClientMessage_CUSTOM = (hook, context, cb) => {
  if (context.payload) {
    if (context.payload.action === 'recieveDefineMessage') {
      const message = context.payload.message;
      if (message) {
        $(message).each(function () {
          const title = this.meta.words[0].word;
          const text = this.glossary;
          $.gritter.add({title: `${title} - ${this.meta.synsetType}`, text});
          return false; // end the each
        });
      } else {
        const title = 'No Match';
        const text = 'No definition found';
        $.gritter.add({title: `${title}`, text});
      }
    }
  }
  cb();
};

exports.postAceInit = (name, context) => {
  $('#ep_define_input_ok').click(() => {
    senddefine();
    return false;
  });
  $('.dropdown-help').hover(() => {
    context.ace.callWithAce((ace) => {
      const rep = ace.ace_getRep();
      const line = rep.lines.atIndex(rep.selStart[0]);
      const selectedText = line.text.substring(rep.selStart[1], rep.selEnd[1]);
      $('#ep_define_input').val(selectedText);
    }, 'define', true);
  });
};

const senddefine = () => {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  const message = $('#ep_define_input').val().toLowerCase();
  // Send chat message to send to the server
  const sendMsg = {
    type: 'define',
    action: 'sendDefineMessage',
    message,
    padId,
    myAuthorId,
  };
  pad.collabClient.sendMessage(sendMsg); // Send the define request to the server
};
