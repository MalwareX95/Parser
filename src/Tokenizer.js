"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
class Tokenizer {
    constructor() {
        this.str = '';
        this.cursor = 0;
    }
    init(str) {
        this.str = str;
    }
    isEOF() {
        return this.cursor === this.str.length;
    }
    hasMoreTokens() {
        return this.cursor < this.str.length;
    }
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }
        /**
         * Numbers
         */
        if (!Number.isNaN(Number(this.str[this.cursor]))) {
            let number = '';
            while (!Number.isNaN(Number(this.str[this.cursor]))) {
                number += this.str[this.cursor++];
            }
            return {
                type: 'Number',
                value: number,
            };
        }
        /**
         * String
         */
        if (this.str[this.cursor] === '"') {
            let s = '';
            do {
                s += this.str[this.cursor++];
            } while (this.str[this.cursor] !== '"' && !this.isEOF());
            s += this.str[this.cursor++]; // skip
            return {
                type: 'String',
                value: s,
            };
        }
        return null;
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=Tokenizer.js.map