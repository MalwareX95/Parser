"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../src/Parser");
const parser = new Parser_1.Parser();
const program = `
    /*
     * Documentation comment
     */
    42;
`;
/**
 *
 */
const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));
//# sourceMappingURL=run.js.map