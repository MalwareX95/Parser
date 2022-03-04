import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(`-x;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UnaryExpression',
                    operator: '-',
                    argument: {
                        type: 'Identifier',
                        name: 'x'
                    },
                }
            }
        ]
    })

    test(`!x;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UnaryExpression',
                    operator: '!',
                    argument: {
                        type: 'Identifier',
                        name: 'x'
                    },
                }
            }
        ]
    })
}