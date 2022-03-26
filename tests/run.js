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
const relational_test_1 = __importDefault(require("./relational-test"));
const equality_test_1 = __importDefault(require("./equality-test"));
const logical_test_1 = __importDefault(require("./logical-test"));
const unary_test_1 = __importDefault(require("./unary-test"));
const while_test_1 = __importDefault(require("./while-test"));
const do_while_test_1 = __importDefault(require("./do-while-test"));
const for_test_1 = __importDefault(require("./for-test"));
const function_declaration_test_1 = __importDefault(require("./function-declaration-test"));
const member_test_1 = __importDefault(require("./member-test"));
const call_test_1 = __importDefault(require("./call-test"));
const tests = [
    literals_test_1.default,
    statement_list_test_1.default,
    block_test_1.default,
    empty_statement_test_1.default,
    math_test_1.default,
    assignment_test_1.default,
    if_test_1.default,
    relational_test_1.default,
    equality_test_1.default,
    logical_test_1.default,
    unary_test_1.default,
    while_test_1.default,
    do_while_test_1.default,
    for_test_1.default,
    function_declaration_test_1.default,
    member_test_1.default,
    call_test_1.default,
];
const parser = new Parser_1.Parser();
/**
 * For manual tests.
 */
function exec() {
    ``;
    const program = `
        square(2);
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