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
        var _a;
        const statementList = [this.Statement()];
        while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== stopLookaheadType) {
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
     * VariableStatementInit
     * : 'let' VariableDeclarationList
     * ;
     */
    VariableStatementInit() {
        this.eat('let');
        const declarations = this.VariableDeclarationList();
        return {
            type: 'VariableStatement',
            declarations,
        };
    }
    /**
     * VariableStatement
     * : VariableStatementInit ';'
     * ;
     */
    VariableStatement() {
        const variableStatement = this.VariableStatementInit();
        this.eat(';');
        return variableStatement;
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
    IterationStatement() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case 'while':
                return this.WhileStatement();
            case 'do':
                return this.DoWhileStatement();
            default:
                return this.ForStatement();
        }
    }
    /**
     * WhileStatement
     * : 'while' '(' Expression ')' Statement
     * ;
     */
    WhileStatement() {
        this.eat('while');
        this.eat('(');
        const test = this.Expression();
        this.eat(')');
        const body = this.Statement();
        return {
            type: 'WhileStatement',
            test,
            body,
        };
    }
    /**
     * DoWhileStatement
     * : 'do' Statement 'while' '(' Expression ')' ';'
     * ;
     */
    DoWhileStatement() {
        this.eat('do');
        const body = this.Statement();
        this.eat('while');
        this.eat('(');
        const test = this.Expression();
        this.eat(')');
        this.eat(';');
        return {
            type: 'DoWhileStatement',
            body,
            test,
        };
    }
    /**
     * ForStatementInit
     * : VariableStatementInit
     * | Expression
     * ;
     */
    ForStatementInit() {
        var _a;
        if (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === 'let') {
            return this.VariableStatementInit();
        }
        return this.SequenceExpression();
    }
    SequenceExpression() {
        var _a;
        const assignments = [];
        do {
            const expression = this.AssignmentExpression();
            if (expression.type !== 'AssignmentExpression') {
                throw SyntaxError(`unexpected expression: ${expression.type}, expected AssignmentExpression`);
            }
            assignments.push(expression);
        } while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === ',' && this.eat(','));
        return {
            type: 'SequenceExpression',
            assignments,
        };
    }
    /**
     * ForStatement
     * : 'for' '(' OptForStatementInit ';' OptExpression ';' OptExpression ')' Statement
     * ;
     */
    ForStatement() {
        var _a, _b, _c;
        this.eat('for');
        this.eat('(');
        const init = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== ';' ? this.ForStatementInit() : null;
        this.eat(';');
        const test = ((_b = this.lookahead) === null || _b === void 0 ? void 0 : _b.type) !== ';' ? this.Expression() : null;
        this.eat(';');
        const update = ((_c = this.lookahead) === null || _c === void 0 ? void 0 : _c.type) !== ')' ? this.Expression() : null;
        this.eat(')');
        const body = this.Statement();
        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body,
        };
    }
    /**
     * FormalParameterList
     * : Identifier
     * | FormalParameterList ',' Identifier
     * ;
     */
    FormalParameterList() {
        var _a;
        const params = [];
        do {
            params.push(this.Identifier());
        } while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === ',' && this.eat(','));
        return params;
    }
    /**
     * FunctionDeclaration
     * : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
     * ;
     */
    FunctionDeclaration() {
        var _a;
        this.eat('def');
        const name = this.Identifier();
        this.eat('(');
        //OptFormalParameterList
        const params = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== ')' ? this.FormalParameterList() : [];
        this.eat(')');
        const body = this.BlockStatement();
        return {
            type: 'FunctionDeclaration',
            name,
            params,
            body,
        };
    }
    /**
     * ReturnStatement
     * : 'return' OptExpression ';'
     * ;
     */
    ReturnStatement() {
        var _a;
        this.eat('return');
        const argument = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== ';' ? this.Expression() : null;
        this.eat(';');
        return {
            type: 'ReturnStatement',
            argument,
        };
    }
    /**
     * Statement
     * : ExpressionStatement
     * | BlockStatement
     * | EmptyStatement
     * | VariableStatement
     * | IfStatement
     * | IterationStatement
     * | FunctionDeclaration
     * | ReturnStatement
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
            case 'def':
                return this.FunctionDeclaration();
            case 'return':
                return this.ReturnStatement();
            case 'while':
            case 'do':
            case 'for':
                return this.IterationStatement();
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
        if (node.type === 'Identifier' || node.type === 'MemberExpression') {
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
     * : CallMemberExpression
     * ;
     */
    LeftHandSideExpression() {
        return this.CallMemberExpression();
    }
    /**
     * CallMemberExpression
     * : MemberExpression
     * | CallExpression
     * ;
     */
    CallMemberExpression() {
        var _a;
        const member = this.MemberExpression();
        // See if we have a call expression
        if (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === '(') {
            return this.CallExpression(member);
        }
        // Simple member expression
        return member;
    }
    /**
     * Generic call expression helper.
     *
     * CallExpression
     * : Callee Arguments
     * ;
     *
     * Callee
     * : MemberExpression
     * | CallExpression
     * ;
     */
    CallExpression(callee) {
        var _a;
        let callExpression = {
            type: 'CallExpression',
            callee,
            arguments: this.Arguments(),
        };
        if (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === '(') {
            callExpression = this.CallExpression(callExpression);
        }
        return callExpression;
    }
    /**
     * Arguments
     * : '(' OptArgumentList ')'
     * ;
     */
    Arguments() {
        var _a;
        this.eat('(');
        const argumentList = ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) !== ')' ? this.ArgumentList() : [];
        this.eat(')');
        return argumentList;
    }
    /**
     * ArgumentList
     * : AssignmentExpression
     * | ArgumentList ',' AssignmentExpression
     * ;
     */
    ArgumentList() {
        var _a;
        const argumentList = [];
        do {
            argumentList.push(this.AssignmentExpression());
        } while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === ',' && this.eat(','));
        return argumentList;
    }
    /**
     * MemberExpression
     * : PrimaryExpression
     * | MemberExpression '.' Identifier
     * | MemberExpression '[' Expression ']'
     * ;
     */
    MemberExpression() {
        var _a, _b, _c, _d;
        let object = this.PrimaryExpression();
        while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === '.' || ((_b = this.lookahead) === null || _b === void 0 ? void 0 : _b.type) === '[') {
            // MemberExpression '.' Identifier
            if (((_c = this.lookahead) === null || _c === void 0 ? void 0 : _c.type) === '.') {
                this.eat('.');
                const property = this.Identifier();
                object = {
                    type: 'MemberExpression',
                    computed: false,
                    object,
                    property,
                };
            }
            // MemberExpression '[' Expression ']'
            if (((_d = this.lookahead) === null || _d === void 0 ? void 0 : _d.type) === '[') {
                this.eat('[');
                const property = this.Expression();
                this.eat(']');
                object = {
                    type: 'MemberExpression',
                    computed: true,
                    object,
                    property,
                };
            }
        }
        return object;
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
     * : LogicalORExpression
     * | LeftHandSideExpression AssignmentOperator AssignmentExpression //Right recursion
     * ;
     */
    AssignmentExpression() {
        var _a;
        const left = this.LogicalORExpression();
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
     * EqualityOperator: ==, !=
     *
     *  x == y
     *  x != y
     *
     * EqualityExpression
     * : RelationalExpression EqualityOperator EqualityExpression
     * | RelationalExpression
     * ;
     */
    EqualityExpression() {
        return this.BinaryExpression('RelationalExpression', 'EqualityOperator');
    }
    /*Generic helper for LogicalExpression nodes.*/
    LogicalExpression(builderName, tokenType) {
        var _a;
        const builderMethod = this[builderName].bind(this);
        let left = builderMethod();
        while (((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) === tokenType) {
            const operator = this.eat(tokenType).value;
            const right = builderMethod();
            left = {
                type: 'LogicalExpression',
                operator,
                left,
                right,
            };
        }
        return left;
    }
    /**
     * Logical OR expression
     * x || y
     *
     * LogicalORExpression
     * : EqualityExpression LogicalOr LogicalAndExpression
     * | EqualityExpression
     * ;
     */
    LogicalORExpression() {
        return this.LogicalExpression('LogicalANDExpression', 'LogicalOr');
    }
    /**
     * Logical AND expression
     * x && y
     *
     * LogicalANDExpression
     * : EqualityExpression LogicalAnd LogicalAndExpression
     * | EqualityExpression
     * ;
     */
    LogicalANDExpression() {
        return this.LogicalExpression('EqualityExpression', 'LogicalAnd');
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
        return tokenType === 'Number' ||
            tokenType === 'String' ||
            tokenType === 'false' ||
            tokenType === 'true' ||
            tokenType === 'null';
    }
    /**
     * PrimaryExpression
     * : Literal
     * | ParenthesizedExpression
     * | Identifier
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
                return this.Identifier();
        }
    }
    /**
     * UnaryExpression
     * : LeftHandSideExpression
     * | AdditiveOperator UnaryExpression
     * | LogicalNot UnaryExpression
     * ;
     */
    UnaryExpression() {
        var _a;
        let operator = null;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case 'AdditiveOperator':
                operator = this.eat('AdditiveOperator').value;
                break;
            case 'LogicalNot':
                operator = this.eat('LogicalNot').value;
                break;
        }
        if (operator != null) {
            return {
                type: 'UnaryExpression',
                operator,
                argument: this.UnaryExpression(),
            };
        }
        return this.LeftHandSideExpression();
    }
    /**
     * MultiplicativeExpression
     * : UnaryExpression
     * | MultiplicativeExpression MultiplicativeOperator UnaryExpression
     * ;
     */
    MultiplicativeExpression() {
        return this.BinaryExpression('UnaryExpression', 'MultiplicativeOperator');
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
    /**
     * NullLiteral
     * : 'null'
     * ;
     */
    NullLiteral() {
        this.eat('null');
        return {
            type: 'NullLiteral',
            value: null
        };
    }
    /**
     * BooleanLiteral
     * : 'true'
     * | 'false'
     * ;
     */
    BooleanLiteral(value) {
        this.eat(value ? 'true' : 'false');
        return {
            type: 'BooleanLiteral',
            value
        };
    }
    /**
     * Literal
     * : NumericLiteral
     * | StringLiteral
     * | BooleanLiteral
     * | NullLiteral
     * ;
     */
    Literal() {
        var _a;
        switch ((_a = this.lookahead) === null || _a === void 0 ? void 0 : _a.type) {
            case 'Number':
                return this.NumericLiteral();
            case 'String':
                return this.StringLiteral();
            case 'true':
                return this.BooleanLiteral(true);
            case 'false':
                return this.BooleanLiteral(false);
            case 'null':
                return this.NullLiteral();
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