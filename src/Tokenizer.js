"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
const Spec = [
    //-----------------------------
    // Whitespace:
    [/^\s+/],
    //-----------------------------
    // Comments:
    // Skip single-line comments:
    [/^\/\/.*/],
    // Skip multi-line comments:
    [/^\/\*[\s\S]*?\*\//],
    //-----------------------------
    // Symbols, delimiter
    [/^;/, ';'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^,/, ','],
    [/^\./, '.'],
    [/^\[/, '['],
    [/^\]/, ']'],
    //-----------------------------
    // Keywords:
    [/^\blet\b/, 'let'],
    [/^\bif\b/, 'if'],
    [/^\belse\b/, 'else'],
    [/^\btrue\b/, 'true'],
    [/^\bfalse\b/, 'false'],
    [/^\bnull\b/, 'null'],
    [/^\bwhile\b/, 'while'],
    [/^\bdo\b/, 'do'],
    [/^\bfor\b/, 'for'],
    [/^\bdef\b/, 'def'],
    [/^\breturn\b/, 'return'],
    [/^\bclass\b/, 'class'],
    [/^\bextends\b/, 'extends'],
    [/^\bsuper\b/, 'super'],
    [/^\bnew\b/, 'new'],
    [/^\bthis\b/, 'this'],
    //-----------------------------
    // Numbers: 
    [/^\d+/, 'Number'],
    //-----------------------------
    // Identifiers:
    [/^\w+/, 'Identifier'],
    //-----------------------------
    // Equality operators: ==, !=
    [/^[=!]=/, 'EqualityOperator'],
    //-----------------------------
    // Assignment operators: =, *=, /=, -=
    [/^=/, 'SimpleAssign'],
    [/^[*/+-]=/, 'ComplexAssign'],
    //-----------------------------
    // Math operators +, -, *, /
    [/^[+-]/, 'AdditiveOperator'],
    [/^[*/]/, 'MultiplicativeOperator'],
    //-----------------------------
    // Relational operators: >, >=, <, <=
    [/^[><]=?/, 'RelationalOperator'],
    //-----------------------------
    // Logical operators &&, ||
    [/^&&/, 'LogicalAnd'],
    [/^\|\|/, 'LogicalOr'],
    [/^!/, 'LogicalNot'],
    //-----------------------------
    // Strings:
    [/^"[^"]*"/, 'String'],
    [/^'[^']*'/, 'String']
];
class Tokenizer {
    constructor() {
        this.str = '';
        this.cursor = 0;
    }
    init(str) {
        this.str = str;
        this.cursor = 0;
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
        const string = this.str.slice(this.cursor);
        for (const [regex, tokenType] of Spec) {
            const tokenValue = this.match(regex, string);
            // Couldn't match this rule, continue.
            if (tokenValue == null) {
                continue;
            }
            // Should skip token, e.g whitespace.
            if (tokenType == null) {
                return this.getNextToken();
            }
            return {
                type: tokenType,
                value: tokenValue,
            };
        }
        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }
    /**
     * Matches a token for regular expression
     */
    match(regex, str) {
        const matched = regex.exec(str);
        if (!matched) {
            return null;
        }
        this.cursor += matched[0].length;
        return matched[0];
    }
}
exports.Tokenizer = Tokenizer;
//# sourceMappingURL=Tokenizer.js.map