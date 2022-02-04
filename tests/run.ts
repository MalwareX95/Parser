import { Parser } from "../src/Parser";

const parser = new Parser();

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