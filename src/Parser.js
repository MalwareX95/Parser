"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
class Parser {
    constructor() {
        this.str = '';
    }
    parse(str) {
        this.str = str;
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
        return this.NumericLiteral();
    }
    /**
     * NumericLiteral
     * : Number
     */
    NumericLiteral() {
        return {
            type: 'NumericLiteral',
            value: Number(this.str),
        };
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map