"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Tokenizer_1 = require("./Tokenizer");
class Parser {
    constructor() {
        this.str = '';
        this.tokenizer = new Tokenizer_1.Tokenizer();
    }
    parse(str) {
        this.str = str;
        this.tokenizer.init(str);
        /**
         * Prime the tokenizer to obtain the first
         * token which is our lookahead. The lookahead is
         * used for predictive parsing.
         */
        this.lookahead = this.tokenizer.getNextToken();
        return this.Program();
    }
    /**
     * Main entry point.
     *
     * Program
     * : NumericLiteral
     * ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.Literal(),
        };
    }
    Literal() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case 'Number':
                return this.NumericLiteral();
            case 'String':
                return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: unexpected literal production`);
    }
    eat(tokenType) {
        const token = this.lookahead;
        if (token == null) {
            throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`);
        }
        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}, expected: "${tokenType}"`);
        }
        //Advance to next token.
        this.lookahead = this.tokenizer.getNextToken();
        return token;
    }
    /**
     * StringLiteral
     * : String
     * ;
     */
    StringLiteral() {
        const token = this.eat('String');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    }
    ;
    /**
     * NumericLiteral
     * : Number
     * ;
     */
    NumericLiteral() {
        const token = this.eat('Number');
        return {
            type: 'NumericLiteral',
            value: Number(token.value),
        };
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map