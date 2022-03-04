"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
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
    });
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
    });
};
//# sourceMappingURL=unary-test.js.map