import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(`
        {
            42;
            "hello";
        }
    `,
    {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                             type: 'NumericLiteral',
                             value: 42
                        }
                    },
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'StringLiteral',
                            value: 'hello'
                        }
                    }
                ]
            }
        ]
    })
    
    // Empty block:

    test(`
    {
    }
    `,
    {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [],
            }
        ]
    })

    test(`
    {
        42;
        {
            "hello";   
        }
    }
    `,
    {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                             type: 'NumericLiteral',
                             value: 42
                        }
                    },
                    {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'StringLiteral',
                                    value: 'hello',
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    })
    
}