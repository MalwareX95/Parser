import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(`x > 0;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '>',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 0
                    },
                }
            }
        ]
    })
}
