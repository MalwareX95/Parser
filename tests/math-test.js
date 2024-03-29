"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
    // Addition:
    test(`2 + 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 2,
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2,
                    },
                }
            }
        ]
    });
    // Nested binary expressions:
    // left: 3 + 2
    // right: 2
    test(`3 + 2 - 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: {
                        type: 'BinaryExpression',
                        left: {
                            type: 'NumericLiteral',
                            value: 3,
                        },
                        operator: '+',
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });
    test(`2 * 2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'BinaryExpression',
                        left: {
                            type: 'NumericLiteral',
                            value: 2,
                        },
                        operator: '*',
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });
    test(`2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'NumericLiteral',
                        value: 2,
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2,
                    }
                }
            }
        ]
    });
    // Precedence of operations: 
    test(`2 + 2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 2,
                    },
                    right: {
                        type: 'BinaryExpression',
                        operator: '*',
                        left: {
                            type: 'NumericLiteral',
                            value: 2,
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    }
                }
            }
        ]
    });
    test(`(2 + 2) * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: {
                            type: 'NumericLiteral',
                            value: 2,
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2,
                    },
                }
            }
        ]
    });
};
//# sourceMappingURL=math-test.js.map