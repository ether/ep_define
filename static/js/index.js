exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  if(context.payload){
    if(context.payload.action == "recieveDefineMessage"){
      var message = context.payload.message;
      if(message){
        $(message).each(function(){
          var title = this.meta.words[0].word;
          var text = this.glossary;
          $.gritter.add({title: title + " - " + this.meta.synsetType, "text": text });
          return false; // end the each
        });
      }
    }
  }
}

exports.postAceInit = function(name, context){
  $('#ep_define_input_ok').click(function(){
    senddefine();
    return false;
  });
  $('.dropdown-help').hover(function(){
    context.ace.callWithAce(function(ace){
      var rep = ace.ace_getRep();
      var line = rep.lines.atIndex(rep.selStart[0]);
      var selectedText = line.text.substring(rep.selStart[1], rep.selEnd[1]);
      $('#ep_define_input').val(selectedText);
    }, 'define', true);
  });
}

function senddefine(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#ep_define_input').val().toLowerCase();
  // Send chat message to send to the server
  var message = {
    type : 'define',
    action : 'sendDefineMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  pad.collabClient.sendMessage(message);  // Send the define request to the server
}
