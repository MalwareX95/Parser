"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Tokenizer_1 = require("./Tokenizer");
//----------------------------------
// Default AST node factories
const DefaultFactory = {
    Program(body) {
        return {
            type: 'Program',
            body
        };
    },
    EmptyStatement() {
        return {
            type: 'EmptyStatement',
        };
    },
    BlockStatement(body) {
        return {
            type: 'BlockStatement',
            body
        };
    },
    ExpressionStatement(expression) {
        return {
            type: 'ExpressionStatement',
            expression
        };
    },
    StringLiteral(value) {
        return {
            type: 'StringLiteral',
            value
        };
    },
    NumericLiteral(value) {
        return {
            type: 'NumericLiteral',
            value,
        };
    }
};
//----------------------------------
// S-expression AST node factories 
const SExpressionFactory = {
    Program(body) {
        return ['begin', body];
    },
    EmptyStatement() { },
    BlockStatement(body) {
        return ['begin', body];
    },
    ExpressionStatement(expression) {
        return expression;
    },
    StringLiteral(value) {
        return `"${value}"`;
    },
    NumericLiteral(value) {
        return value;
    }
};
const AST_MODE = 's-expression';
const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory;
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
        return factory.Program(this.StatementList());
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
        return factory.EmptyStatement();
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
        return factory.BlockStatement(body);
    }
    /**
     * ExpressionStatement
     * : Expression ';'
     * ;
     */
    ExpressionStatement() {
        const expression = this.Expression();
        this.eat(';');
        return factory.ExpressionStatement(expression);
    }
    /**
     * Expression
     * : Literal
     * ;
     */
    Expression() {
        return this.Literal();
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
        return factory.StringLiteral(token.value.slice(1, -1));
    }
    ;
    /**
     * NumericLiteral
     * : Number
     * ;
     */
    NumericLiteral() {
        const token = this.eat('Number');
        return factory.NumericLiteral(Number(token.value));
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map