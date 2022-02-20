"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("../src/Parser");
const assert_1 = __importDefault(require("assert"));
const literals_test_1 = __importDefault(require("./literals-test"));
const statement_list_test_1 = __importDefault(require("./statement-list-test"));
const block_test_1 = __importDefault(require("./block-test"));
const empty_statement_test_1 = __importDefault(require("./empty-statement-test"));
const math_test_1 = __importDefault(require("./math-test"));
const assignment_test_1 = __importDefault(require("./assignment-test"));
const if_test_1 = __importDefault(require("./if-test"));
const tests = [
    literals_test_1.default,
    statement_list_test_1.default,
    block_test_1.default,
    empty_statement_test_1.default,
    math_test_1.default,
    assignment_test_1.default,
    if_test_1.default,
    // relationalTest
];
const parser = new Parser_1.Parser();
/**
 * For manual tests.
 */
function exec() {
    const program = `
        if(x > 5) {
            x = 1;
        }
    `;
    const ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}
exec();
function test(program, expected) {
    const ast = parser.parse(program);
    assert_1.default.deepEqual(ast, expected);
}
tests.forEach(testRun => testRun(test));
console.log('All assertions passed!');
//# sourceMappingURL=run.js.map