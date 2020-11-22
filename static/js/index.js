exports.handleClientMessage_CUSTOM = function (hook, context, cb) {
  if (context.payload) {
    if (context.payload.action == 'recieveDefineMessage') {
      const message = context.payload.message;
      if (message) {
        $(message).each(function () {
          const title = this.meta.words[0].word;
          const text = this.glossary;
          $.gritter.add({title: `${title} - ${this.meta.synsetType}`, text});
          return false; // end the each
        });
      }
    }
  }
};

exports.postAceInit = function (name, context) {
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

function senddefine() {
  const myAuthorId = pad.getUserId();
  const padId = pad.getPadId();
  var message = $('#ep_define_input').val().toLowerCase();
  // Send chat message to send to the server
  var message = {
    type: 'define',
    action: 'sendDefineMessage',
    message,
    padId,
    myAuthorId,
  };
  pad.collabClient.sendMessage(message); // Send the define request to the server
}
