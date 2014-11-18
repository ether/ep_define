var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = function(hook_name, args, cb){
  return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb)
{
  //  args.content = eejs.require('ep_define/templates/define.ejs', {settings : false}) + args.content;
  return cb();
}

exports.eejsBlock_dd_help = function(hook_name, args, cb){
  args.content = eejs.require('ep_define/templates/define.ejs', {settings : false}) + args.content;
  return cb();
}

