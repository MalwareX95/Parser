import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(`
    for(let i = 0; i < 10; i += 1) {
        x += 1;
    }
    `, {
        type: 'Program',
        body: [
            {
                type: 'ForStatement',
                init: {
                    type: 'VariableStatement',
                    declarations: [
                        {
                            type: 'VariableDeclaration',
                            id: {
                                type: 'Identifier',
                                name: 'i', 
                            },
                            init: {
                                type: 'NumericLiteral',
                                value: 0,
                            }
                        }
                    ]
                },
                test: {
                    type: 'BinaryExpression',
                    operator: '<',
                    left: {
                        type: 'Identifier',
                        name: 'i',
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 10,
                    }
                },
                update: {
                    type: 'AssignmentExpression',
                    operator: '+=',
                    left: {
                        type: 'Identifier',
                        name: 'i',
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 1,
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'AssignmentExpression',
                                operator: '+=',
                                left: {
                                    type: 'Identifier',
                                    name: 'x',
                                },
                                right: {
                                    type: 'NumericLiteral',
                                    value: 1,
                                }
                            }
                        }
                    ]
                }
            }
        ]
    })

    test(`
    for(;;) {
    }
    `, {
        type: 'Program',
        body: [
            {
                type: 'ForStatement',
                init: null,
                test: null,
                update: null,
                body: {
                    type: 'BlockStatement',
                    body: []
                }
            }
        ]
    })
}