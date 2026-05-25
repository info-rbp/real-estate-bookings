"use strict";
const handlerModule = require("./dist/functions/bootstrap-tenant/index.js");
module.exports = handlerModule.default || handlerModule;
