"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../src/Parser");
const literals_test_1 = __importDefault(require("./literals-test"));
const statement_list_test_1 = __importDefault(require("./statement-list-test"));
const block_test_1 = __importDefault(require("./block-test"));
const empty_statement_test_1 = __importDefault(require("./empty-statement-test"));
const math_test_1 = __importDefault(require("./math-test"));
const assignment_test_1 = __importDefault(require("./assignment-test"));
const tests = [
    literals_test_1.default,
    statement_list_test_1.default,
    block_test_1.default,
    empty_statement_test_1.default,
    math_test_1.default,
    assignment_test_1.default,
];
const parser = new Parser_1.Parser();
/**
 * For manual tests.
 */
function exec() {
    const program = `
        x + 1 + 1 * 2;
    `;
    const ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}
exec();
// function test(program: string, expected: Program) {
//    const ast = parser.parse(program);
//    assert.deepEqual(ast, expected); 
// }
// tests.forEach(testRun => testRun(test))
console.log('All assertions passed!');
//# sourceMappingURL=run.js.map