import { Program } from "../src/Parser"

export type TestCase = (str: string, program: Program) => void

export default (test: TestCase) => {
    // Numeric literal
    test(`42;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'NumericLiteral',
                    value: 42
                }
            }
        ]
    })

    // String literal
    test(`"hello";`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    })

    // String literal
    test(`'hello';`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    })
}