"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (test) => {
    test(`
        "hello";

        42;
        `, {
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
    });
};
//# sourceMappingURL=statement-list-test.js.map