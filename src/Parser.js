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
     * : StatementList
     * ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.StatementList(),
        };
    }
    /**
     * StatementList
     * : Statement
     * | StatementList Statement -> Statement Statement Statement Statement
     * ;
     */
    StatementList(stopLookaheadType) {
        const statementList = [this.Statement()];
        while (this.lookahead && this.lookahead.type !== stopLookaheadType) {
            statementList.push(this.Statement());
        }
        return statementList;
    }
    /**
     * Statement
     * : ExpressionStatement
     * | BlockStatement
     * ;
     */
    Statement() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }
    /**
     * EmptyStatement
     * : ';'
     * ;
     */
    EmptyStatement() {
        this.eat(';');
        return {
            type: 'EmptyStatement',
        };
    }
    /**
     * BlockStatement
     * : '{' OptStatementList '}'
     * ;
     */
    BlockStatement() {
        var _a;
        this.eat('{');
        const body = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== '}' ? this.StatementList('}') : [];
        this.eat('}');
        return {
            type: 'BlockStatement',
            body
        };
    }
    /**
     * ExpressionStatement
     * : Expression ';'
     * ;
     */
    ExpressionStatement() {
        const expression = this.Expression();
        this.eat(';');
        return {
            type: 'ExpressionStatement',
            expression
        };
    }
    /**
     * Expression
     * : AdditiveExpression
     * ;
     */
    Expression() {
        return this.AdditiveExpression();
    }
    /**
     * ParenthesizedExpression
     * : '(' Expression ')'
     * ;
     */
    ParenthesizedExpression() {
        this.eat('(');
        const expression = this.Expression();
        this.eat(')');
        return expression;
    }
    /**
     * PrimaryExpression
     * : Literal
     * | ParenthesizedExpression
     * ;
     */
    PrimaryExpression() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.Literal();
        }
    }
    /**
     * MultiplicativeExpression
     * : PrimaryExpression
     * | MultiplicativeExpression MultiplicativeOperator PrimaryExpression -> PrimaryExpression MultiplicativeOperator MultiplicativeExpression MultiplicativeOperator MultiplicativeExpression
     * ;
     */
    MultiplicativeExpression() {
        return this.BinaryExpression('PrimaryExpression', 'MultiplicativeOperator');
    }
    /**
     * AdditiveExpression
     * : MultiplicativeExpression
     * ; AdditiveExpression AdditiveOperator MultiplicativeExpression
     */
    AdditiveExpression() {
        return this.BinaryExpression('MultiplicativeExpression', 'AdditiveOperator');
    }
    BinaryExpression(builderName, tokenType) {
        var _a;
        const builderMethod = this[builderName].bind(this);
        let left = builderMethod();
        while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === tokenType) {
            // Operator: +, -, *, /
            const operator = this.eat(tokenType).value;
            const right = builderMethod();
            left = {
                type: 'BinaryExpression',
                operator: operator,
                left,
                right,
            };
        }
        return left;
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