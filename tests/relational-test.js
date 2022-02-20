"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
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
    });
};
//# sourceMappingURL=relational-test.js.map