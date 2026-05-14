'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_editbarMenuRight = (hookName, args, cb) => {
  args.content = eejs.require('ep_define/templates/define.ejs', {settings: false}) + args.content;
  return cb();
};
