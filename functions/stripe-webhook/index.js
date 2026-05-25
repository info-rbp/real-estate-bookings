"use strict";
const handlerModule = require("./dist/functions/stripe-webhook/index.js");
module.exports = handlerModule.default || handlerModule;
