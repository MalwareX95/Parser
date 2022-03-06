import { Parser, Program } from "../src/Parser";
import assert from 'assert'
import literalTests from './literals-test'
import statementListTest from "./statement-list-test";
import blockTest from "./block-test";
import emptyStatementTest from "./empty-statement-test";
import mathTest from "./math-test";
import assignmentTest from "./assignment-test";
import ifTest from "./if-test";
import relationalTest from "./relational-test";
import equalityTest from "./equality-test";
import logicalTest from "./logical-test";
import unaryTest from "./unary-test";
import whileTest from "./while-test";
import doWhileTest from "./do-while-test";
import forTest from "./for-test";

const tests = [
    literalTests,
    statementListTest,
    blockTest,
    emptyStatementTest,
    mathTest,
    assignmentTest,
    ifTest,
    relationalTest,
    equalityTest,
    logicalTest,
    unaryTest,
    whileTest,
    doWhileTest,
    forTest,
];

const parser = new Parser();

/**
 * For manual tests.
 */
function exec() {``
    const program = `
    for (;;) {
    }
    `;

    const ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}

exec()

function test(program: string, expected: Program) {
   const ast = parser.parse(program);
   assert.deepEqual(ast, expected); 
}

tests.forEach(testRun => testRun(test))

console.log('All assertions passed!')