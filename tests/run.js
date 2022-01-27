"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../src/Parser");
const parser = new Parser_1.Parser();
const program = `"hello"`;
const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
//# sourceMappingURL=run.js.map