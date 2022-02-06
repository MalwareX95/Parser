import { Parser, Program } from "../src/Parser";
import assert from 'assert'
import literalTests from './literals-test'
import statementListTest from "./statement-list-test";
import blockTest from "./block-test";
import emptyStatementTest from "./empty-statement-test";

const tests = [
    literalTests,
    statementListTest,
    blockTest,
    emptyStatementTest,
];

const parser = new Parser();

/**
 * For manual tests.
 */
function exec() {
    const program = `
        /*
         * Documentation comment
         */
        "hello";

        //Number:
        42;
        10;
    `;

    const ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}

exec()

function test(program: string, expected: Program) {
   const ast = parser.parse(program);
   assert.deepEqual(ast, expected); 
}

// tests.forEach(testRun => testRun(test))

// console.log('All assertions passed!')