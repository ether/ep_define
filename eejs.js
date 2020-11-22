const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  args.content += eejs.require('ep_define/templates/define.ejs', {settings: false});
  return cb();
};

exports.eejsBlock_dd_help = function (hook_name, args, cb) {
  args.content = eejs.require('ep_define/templates/define.ejs', {settings: false}) + args.content;
  return cb();
};
