"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
    test(`
    while (x > 10) {
        x -= 1;
    }
    `, {
        type: 'Program',
        body: [
            {
                type: 'WhileStatement',
                test: {
                    type: 'BinaryExpression',
                    operator: '>',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 10
                    }
                },
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'AssignmentExpression',
                                operator: '-=',
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
    });
};
//# sourceMappingURL=while-test.js.map