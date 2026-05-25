"use strict";
const handlerModule = require("./dist/functions/send-notification/index.js");
module.exports = handlerModule.default || handlerModule;
