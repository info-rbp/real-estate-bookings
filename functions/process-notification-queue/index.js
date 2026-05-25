"use strict";
const handlerModule = require("./dist/functions/process-notification-queue/index.js");
module.exports = handlerModule.default || handlerModule;
