import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(
        `
        "hello";

        42;
        `,
        {
            type: 'Program',
            body: [
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'StringLiteral',
                        value: 'hello',
                    }
                },
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'NumericLiteral',
                        value: 42,
                    }
                }
            ]
        }
    )
}