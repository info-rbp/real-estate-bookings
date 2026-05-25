"use strict";
const handlerModule = require("./dist/functions/admin-operations/index.js");
module.exports = handlerModule.default || handlerModule;
