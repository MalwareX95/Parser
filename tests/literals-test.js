"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
    // Numeric literal
    test(`42;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'NumericLiteral',
                    value: 42
                }
            }
        ]
    });
    // String literal
    test(`"hello";`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    });
    // String literal
    test(`'hello';`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    });
};
//# sourceMappingURL=literals-test.js.map