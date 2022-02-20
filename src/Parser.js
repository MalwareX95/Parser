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
     * VariableInitilizer
     * : SimpleAssign AssignmentExpression
     * ;
     */
    VariableInitilizer() {
        this.eat('SimpleAssign');
        return this.AssignmentExpression();
    }
    /**
     * VariableDeclaration
     * : Identifier OptVariableInitializer
     * ;
     */
    VariableDeclaration() {
        var _a, _b;
        const id = this.Identifier();
        // OptVariableInitializer
        const init = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== ';' && ((_b = this.lookahead) === null || _b === void 0 ? void 0 : _b.type) !== ','
            ? this.VariableInitilizer()
            : null;
        return {
            type: 'VariableDeclaration',
            id,
            init,
        };
    }
    /**
     * VariableDeclarationList
     * : VariableDeclaration
     * | VariableDeclarationList ',' VariableDeclaration
     * ;
     */
    VariableDeclarationList() {
        var _a;
        const declarations = [];
        do {
            declarations.push(this.VariableDeclaration());
        } while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === ',' && this.eat(','));
        return declarations;
    }
    /**
     * VariableStatement
     * : 'let' VariableDeclarationList ';'
     * ;
     */
    VariableStatement() {
        this.eat('let');
        const declarations = this.VariableDeclarationList();
        this.eat(';');
        return {
            type: 'VariableStatement',
            declarations,
        };
    }
    /**
     * IfStatement
     * : 'if' '(' Expression ')' Statement
     * | 'if' '(' Expression ')' Statement 'else' Statement
     * ;
     */
    IfStatement() {
        var _a;
        this.eat('if');
        this.eat('(');
        const test = this.Expression();
        this.eat(')');
        const consequent = this.Statement();
        const alternate = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === 'else'
            ? this.eat('else') && this.Statement()
            : null;
        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
        };
    }
    /**
     * Statement
     * : ExpressionStatement
     * | BlockStatement
     * | EmptyStatement
     * | VariableStatement
     * | IfStatement
     * ;
     */
    Statement() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case ';':
                return this.EmptyStatement();
            case 'if':
                return this.IfStatement();
            case '{':
                return this.BlockStatement();
            case 'let':
                return this.VariableStatement();
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
    CheckValidAssignmentTarget(node) {
        if (node.type === 'Identifier') {
            return node;
        }
        throw new SyntaxError('Invalid left-hand side in assignment expression');
    }
    /**
     * Identifier
     * : IDENTIFIER
     * ;
     */
    Identifier() {
        const name = this.eat('Identifier').value;
        return {
            type: 'Identifier',
            name,
        };
    }
    /**
     * LeftHandSideExpression
     * : Identifier
     */
    LeftHandSideExpression() {
        return this.Identifier();
    }
    /**
     * Whether the token is an assignment operator.
     */
    IsAssignmentOperator(tokenType) {
        return tokenType === 'SimpleAssign' || tokenType === 'ComplexAssign';
    }
    /**
     * RELATIONAL_OPERATOR: >, >=, <, <=
     *
     * x > y
     * x >= y
     * x < y
     * x <= y
     *
     * RelationalExpression
     * : AdditiveExpression
     * | AdditiveExpression RelationalOperator RelationalExpression
     * ;
     */
    RelationalExpression() {
        return this.BinaryExpression('AdditiveExpression', 'RelationalOperator');
    }
    /**
     * AssignmentExpression
     * : RelationalExpression
     * | LeftHandSideExpression AssignmentOperator AssignmentExpression //Right recursion
     * ;
     */
    AssignmentExpression() {
        var _a;
        const left = this.RelationalExpression();
        if (!this.IsAssignmentOperator((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type)) {
            return left;
        }
        return {
            type: 'AssignmentExpression',
            operator: this.AssignmentOperator().value,
            left: this.CheckValidAssignmentTarget(left),
            right: this.AssignmentExpression(),
        };
    }
    /**
     * AssignmentOperator
     * : Simple_Assign
     * ;
     */
    AssignmentOperator() {
        var _a;
        if (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === 'SimpleAssign') {
            return this.eat('SimpleAssign');
        }
        return this.eat('ComplexAssign');
    }
    /**
     * Expression
     * : AssignmentExpression
     * ;
     */
    Expression() {
        return this.AssignmentExpression();
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
     * Whether  the token is a literal
     */
    IsLiteral(tokenType) {
        return tokenType === 'Number' || tokenType === 'String';
    }
    /**
     * PrimaryExpression
     * : Literal
     * | ParenthesizedExpression
     * | LeftHandSideExpression
     * ;
     */
    PrimaryExpression() {
        var _a, _b;
        if (this.IsLiteral((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type)) {
            return this.Literal();
        }
        switch ((_b = this.lookahead) === null || _b === void 0 ? void 0 : _b.type) {
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression();
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
                operator,
                left,
                right,
            };
        }
        return left;
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