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

var internalD =  { // TEMP HACK until we have Server provided JSON blobbage
  "banana": "ardvark",
  "blue": "Moah ardvark"
};

exports.postAceInit = function(name, context){

  clientVars.plugins.plugins.ep_define.internalD = internalD;

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

  // Show the definition on a click event
  context.ace.callWithAce(function(ace){
    var doc = ace.ace_getDocument();
    var $inner = $(doc).find('#innerdocbody');

    // On click ensure all image controls are hidden
    $inner.on("click", ".definitionkey", function(e){
      var d = e.currentTarget.innerText; // d is the string we're looking for a definition of
      d = d.trim().toLowerCase(); // Remove whitespace and send to Lower
      $.gritter.add({title: d, "text": internalD[d] });
      return false;
    });
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


/* CustomRegexp provides a wrapper around a RegExp Object which applies a given function to the result of the Regexp
@param regexp the regexp to be wrapped
@param sanitizeResultFn the function to be applied to the result.
*/
var CustomRegexp = function(regexp, sanitizeResultFn){
  this.regexp = regexp;
  this.sanitizeResultFn = sanitizeResultFn;
};

CustomRegexp.prototype.exec = function(text){
  var result = this.regexp.exec(text);
  return this.sanitizeResultFn(result);
}

/* getCustomRegexpFilter returns a linestylefilter compatible filter for a CustomRegexp
  @param customRegexp the CustomRegexp Object
  @param tag the tag to be filtered
  @param linestylefilter reference to linestylefilter module
*/

var getCustomRegexpFilter = function(customRegexp, tag, linestylefilter){
  var filter = linestylefilter.getRegexpFilter(customRegexp, tag);
  return filter;
}

exports.aceGetFilterStack = function(name, context){
  var linestylefilter = context.linestylefilter;
  // This can probably be tidied up a LOT
  var keyfilter = getCustomRegexpFilter(
    new CustomRegexp(definitionKeyRegexp, keySanitizingFn),
    'definitionkey',
    linestylefilter
  );
  var deffilter = getCustomRegexpFilter(
    new CustomRegexp(definitionRegexp, definitionSanitizingFn),
    'definition',
    linestylefilter
  );

  return [keyfilter, deffilter];
  // return [deffilter];
}

/* Define the regular expressions we will use to detect if a string has a definitionkey */
var definitionKeyRegexp = new RegExp(/banana|blue/g); // TEMP Hack -- Actually this can be sorted from internalD;

/* Define the regular expressions we will use to detect if a string has a definitionkey */
var definitionRegexp = new RegExp(/means/g); // TEMP HACK

var keySanitizingFn = function(result){ // Does nothing
  if(!result) return result;
  return result;
};

/* Given "bababa means bobobob" we need to know "bababa" and also context after "means" */
var definitionSanitizingFn = function(result){
  if(!result) return result;
  result.index = -0;
  // First word...
  var dKey = result.input.split(" ")[0].toLowerCase();
  internalD[dKey] = result.input;
  return result;
};

exports.aceCreateDomLine = function(name, context){
  var definition;
  var definitionKey;
  var cls = context.cls;
  var domline = context.domline;

  if (cls.indexOf('definition') >= 0) // if it already has the class of definition
  {
    cls = cls.replace(/(^| )definition:(\S+)/g, function(x0, space, d)
    {
      definition = d;
      return space + "d";
    });
  }

  if (cls.indexOf('definitionkey') >= 0) // if it already has the class of definition
  {
    cls = cls.replace(/(^| )definitionkey:(\S+)/g, function(x0, space, d)
    {
      definitionKey = d;
      return space + "d";
    });
  }

  if (definitionKey || definition)
  {
    if(definitionKey){
      var modifier = {
        extraOpenTags: '<span class="definitionkey">',
        extraCloseTags: '</span>',
        cls: cls
      }
    }
    if(definition){
      var modifier = {
        extraOpenTags: '<span class="definitionkey">',
        extraCloseTags: '</span>',
        cls: cls
      }
    }
    return [modifier];
  }
  return;
}
