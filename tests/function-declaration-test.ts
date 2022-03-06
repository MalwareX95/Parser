import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(`
    def square(x) {
        return x * x;
    }
    `, {
        type: 'Program',
        body: [
            {
                type: 'FunctionDeclaration',
                name: {
                    type: 'Identifier',
                    name: 'square',
                },
                params: [
                    {
                        type: 'Identifier',
                        name: 'x',
                    }
                ],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ReturnStatement',
                            argument: {
                                type: 'BinaryExpression',
                                operator: '*',
                                left: {
                                    type: 'Identifier',
                                    name: 'x',
                                },
                                right: {
                                    type: 'Identifier',
                                    name: 'x',
                                }
                            }
                        }
                    ]
                }
            }
        ]
    })
}