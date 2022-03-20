import { AdditiveOperatorToken, AssignToken, ComplexAssignToken, FunctionOfType, IdentifierToken, LogicalNot, LogicalOperator, OperatorToken, PropType, ReturnTypeOfParserKey, SimpleAssignToken, Token, Tokenizer, TokenType, TokenValue, UnaryOperatorToken } from "./Tokenizer";

type Literal = ReturnTypeOfParserKey<'Literal'>
type Statement = ReturnTypeOfParserKey<'Statement'>
type StatementList = Statement[];
type AssignmentExpressionList = AssignmentExpression[];
type Expression = ReturnTypeOfParserKey<'Expression'>

export type Program = {
    type: 'Program';
    body: StatementList;
}

type ExpressionStatement = {
    type: 'ExpressionStatement';
    expression: AssignmentExpression;
}

type BlockStatement = {
    type: 'BlockStatement';
    body: StatementList
}

type EmptyStatement = {
    type: 'EmptyStatement',
}

type Identifier = {
    type: 'Identifier',
    name: string,
}

type StringLiteral = {
    type: 'StringLiteral';
    value: string;
}

type NumericLiteral = {
    type: 'NumericLiteral';
    value: number;
}

type BooleanLiteral = {
    type: 'BooleanLiteral';
    value: boolean;
}

type NullLiteral = {
    type: 'NullLiteral';
    value: null;
}

type VariableDeclaration = {
    type: 'VariableDeclaration';
    id: Identifier;
    init:  AssignmentExpression | null;
}

type VariableDeclarationList = VariableDeclaration[]

type VariableStatement = { 
    type: 'VariableStatement';
    declarations: VariableDeclarationList;
}

type SequenceExpression = {
    type: 'SequenceExpression';
    assignments: AssignmentExpressionList;
}

type IfStatement = {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
}

type WhileStatement = {
    type: 'WhileStatement';
    test: Expression;
    body: Statement;
}

type DoWhileStatement = {
    type: 'DoWhileStatement';
    body: Statement;
    test: Expression;
}

type FormalParameterList = ReturnTypeOfParserKey<'FormalParameterList'>

type FunctionDeclaration = {
    type: 'FunctionDeclaration';
    name: Identifier;
    params: FormalParameterList;
    body: BlockStatement;
}

type ReturnStatement = {
    type: 'ReturnStatement';
    argument: Expression | null;
}

type ForStatementInit = ReturnTypeOfParserKey<'ForStatementInit'>

type ForStatement = {
    type: 'ForStatement';
    init: ForStatementInit | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}

type MemberExpression = 
{
    type: 'MemberExpression';
    computed: boolean;
    object: AssignmentExpression;
    property: Expression
}

type LogicalExpression = 
{
    type: 'LogicalExpression',
    operator: PropType<LogicalOperator, 'value'>
    left: AssignmentExpression
    right: AssignmentExpression
}

type UnaryExpression = 
{
    type: 'UnaryExpression';
    operator: PropType<UnaryOperatorToken, 'value'>;
    argument: AssignmentExpression
}

type AssignmentExpression = 
| Literal
| Identifier
| LogicalExpression
| UnaryExpression
| BinaryExpression
| MemberExpression
| {
    type: 'AssignmentExpression';
    operator: PropType<AssignToken, 'value'>;
    left: AssignmentExpression;
    right: AssignmentExpression;
}

type BinaryExpression = 
{
    type: 'BinaryExpression';
    operator: PropType<OperatorToken, 'value'>;
    left: AssignmentExpression;
    right: AssignmentExpression
}

export class Parser {
    str = '';

    tokenizer = new Tokenizer();

    lookahead?: Token | null;

    parse(str: string) {
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
        }
    }

    /**
     * StatementList
     * : Statement
     * | StatementList Statement -> Statement Statement Statement Statement
     * ;
     */
    StatementList(stopLookaheadType?: TokenType): StatementList {
        const statementList = [ this.Statement() ]
        
        while(this.lookahead && this.lookahead.type !== stopLookaheadType) {
            statementList.push(this.Statement())
        }

        return statementList;
    }


    /**
     * VariableInitilizer
     * : SimpleAssign AssignmentExpression
     * ;
     */

    VariableInitilizer(): AssignmentExpression {
        this.eat('SimpleAssign');
        return this.AssignmentExpression();
    }

    /**
     * VariableDeclaration
     * : Identifier OptVariableInitializer
     * ;
     */
    VariableDeclaration(): VariableDeclaration {
        const id = this.Identifier();
        
        // OptVariableInitializer
        const init = 
            this.lookahead?.type !== ';' && this.lookahead?.type !== ',' 
            ? this.VariableInitilizer()
            : null;
        
        return {
            type: 'VariableDeclaration',
            id,
            init,
        }
    }

    /**
     * VariableDeclarationList
     * : VariableDeclaration
     * | VariableDeclarationList ',' VariableDeclaration
     * ;
     */
    VariableDeclarationList(): VariableDeclarationList {
        const declarations: VariableDeclarationList = [];

        do {
            declarations.push(this.VariableDeclaration());
        } while(this.lookahead?.type === ',' && this.eat(','));

        return declarations;
    }

    /**
     * VariableStatementInit
     * : 'let' VariableDeclarationList
     * ;
     */
    VariableStatementInit(): VariableStatement {
        this.eat('let');
        const declarations = this.VariableDeclarationList();
        return  {
            type: 'VariableStatement',
            declarations,
        }
    }

    /**
     * VariableStatement
     * : VariableStatementInit ';'
     * ;
     */
    VariableStatement(): VariableStatement {
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
    IfStatement(): IfStatement {
        this.eat('if');

        this.eat('(');
        const test = this.Expression();
        this.eat(')');

        const consequent = this.Statement();

        const alternate = 
            this.lookahead?.type === 'else' 
            ? this.eat('else') && this.Statement() 
            : null;
        
        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate,
        }
    }


    IterationStatement() {
        switch(this.lookahead?.type) {
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
    WhileStatement(): WhileStatement {
        this.eat('while');

        this.eat('(');
        const test = this.Expression();
        this.eat(')');

        const body = this.Statement();

        return {
            type: 'WhileStatement',
            test,
            body,
        }
    }

    /**
     * DoWhileStatement
     * : 'do' Statement 'while' '(' Expression ')' ';'
     * ;
     */
    DoWhileStatement(): DoWhileStatement {
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
        }
    }

    /**
     * ForStatementInit
     * : VariableStatementInit
     * | Expression
     * ;
     */
    ForStatementInit() {
        if(this.lookahead?.type === 'let') {
            return this.VariableStatementInit();
        }

        return this.SequenceExpression();
    }


    SequenceExpression(): SequenceExpression {
        const assignments: AssignmentExpression[] = [];

        do {
            const expression = this.AssignmentExpression();
            
            if(expression.type !== 'AssignmentExpression') {
                throw SyntaxError(`unexpected expression: ${expression.type}, expected AssignmentExpression`)
            }
            assignments.push(expression)
        }
        while(this.lookahead?.type === ',' && this.eat(','))
        
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
    ForStatement(): ForStatement {
        this.eat('for')
        this.eat('(')

        const init = this.lookahead?.type !== ';' ? this.ForStatementInit() : null;
        this.eat(';')

        const test = this.lookahead?.type !== ';' ? this.Expression() : null;
        this.eat(';')

        const update = this.lookahead?.type !== ')' ? this.Expression() : null;
        this.eat(')');

        const body = this.Statement();

        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body,
        }
    }

    /**
     * FormalParameterList
     * : Identifier
     * | FormalParameterList ',' Identifier
     * ;
     */
    FormalParameterList() {
        const params: Identifier[] = [];

        do {
            params.push(this.Identifier());
        } while(this.lookahead?.type === ',' && this.eat(','));

        return params;
    }

    /**
     * FunctionDeclaration 
     * : 'def' Identifier '(' OptFormalParameterList ')' BlockStatement
     * ;
     */
    FunctionDeclaration(): FunctionDeclaration {
        this.eat('def');

        const name = this.Identifier();
        this.eat('(')

        //OptFormalParameterList
        const params = this.lookahead?.type !== ')' ? this.FormalParameterList() : [];
        this.eat(')')

        const body = this.BlockStatement();

        return {
            type: 'FunctionDeclaration',
            name,
            params,
            body,
        }
    }

    /**
     * ReturnStatement
     * : 'return' OptExpression ';'
     * ;
     */
    ReturnStatement(): ReturnStatement {
        this.eat('return');

        const argument = this.lookahead?.type !== ';' ? this.Expression() : null;
        this.eat(';')

        return {
            type: 'ReturnStatement',
            argument,
        }
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
        switch(this.lookahead?.type) {
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
    EmptyStatement(): EmptyStatement {
        this.eat(';');
        return {
            type: 'EmptyStatement',
        }
    }

    /**
     * BlockStatement
     * : '{' OptStatementList '}'
     * ;
     */
    BlockStatement(): BlockStatement {
        this.eat('{');
        const body = this.lookahead?.type !== '}' ? this.StatementList('}') : [];
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
    ExpressionStatement(): ExpressionStatement {
        const expression = this.Expression();
        this.eat(';');
        
        return {
            type: 'ExpressionStatement',
            expression
        }
    }

    CheckValidAssignmentTarget(node: AssignmentExpression): Identifier | MemberExpression {
        if(node.type === 'Identifier' || node.type === 'MemberExpression') {
            return node;
        }

        throw new SyntaxError('Invalid left-hand side in assignment expression');
    }

    /**
     * Identifier
     * : IDENTIFIER
     * ;
     */
    Identifier(): Identifier {
        const name = this.eat<IdentifierToken>('Identifier').value
        return {
            type: 'Identifier',
            name,
        }
    }

    /**
     * LeftHandSideExpression
     * : MemberExpression
     * ;
     */
    LeftHandSideExpression() {
        return this.MemberExpression();
    }

    /**
     * MemberExpression
     * : PrimaryExpression
     * | MemberExpression '.' Identifier
     * | MemberExpression '[' Expression ']'
     * ;
     */
    MemberExpression() {
        let object = this.PrimaryExpression();

        while(this.lookahead?.type === '.' || this.lookahead?.type === '[') {
            // MemberExpression '.' Identifier
            if(this.lookahead?.type === '.') {
                this.eat('.');
                const property = this.Identifier();
                object = {
                    type: 'MemberExpression',
                    computed: false,
                    object,
                    property,
                }
            }

            // MemberExpression '[' Expression ']'
            if(this.lookahead?.type === '[') {
                this.eat('[');
                const property = this.Expression();
                this.eat(']');
                object = {
                    type: 'MemberExpression',
                    computed: true,
                    object,
                    property,
                }
            }
        }

        return object;
    }


    /**
     * Whether the token is an assignment operator.
     */

     IsAssignmentOperator(tokenType?: TokenType) {
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
    RelationalExpression(): AssignmentExpression {
        return this.BinaryExpression('AdditiveExpression', 'RelationalOperator');
    }

    /**
     * AssignmentExpression
     * : LogicalORExpression
     * | LeftHandSideExpression AssignmentOperator AssignmentExpression //Right recursion
     * ;
     */
    AssignmentExpression(): AssignmentExpression {
        const left = this.LogicalORExpression();

        if (!this.IsAssignmentOperator(this.lookahead?.type)) {
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
        if (this.lookahead?.type === 'SimpleAssign') {
            return this.eat<SimpleAssignToken>('SimpleAssign')
        }

        return this.eat<ComplexAssignToken>('ComplexAssign')
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
    EqualityExpression(): AssignmentExpression {
        return this.BinaryExpression('RelationalExpression', 'EqualityOperator')
    }

    /*Generic helper for LogicalExpression nodes.*/
    LogicalExpression<K extends keyof Parser & FunctionOfType<Parser, AssignmentExpression>>(
        builderName: K, tokenType: PropType<LogicalOperator, 'type'>) {
            
        const builderMethod = this[builderName].bind(this) as () => AssignmentExpression;
        let left = builderMethod();

        while(this.lookahead?.type === tokenType) {
            const operator = this.eat<LogicalOperator>(tokenType).value;

            const right = builderMethod();

            left = {
                type: 'LogicalExpression',
                operator,
                left,
                right,
            }
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
    LogicalORExpression(): AssignmentExpression {
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
    LogicalANDExpression(): AssignmentExpression {
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
    IsLiteral(tokenType?: TokenType) {
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
        if (this.IsLiteral(this.lookahead?.type)) {
            return this.Literal();
        }

        switch(this.lookahead?.type) {
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
    UnaryExpression(): AssignmentExpression {
        let operator: TokenValue<UnaryOperatorToken> | null = null;

        switch(this.lookahead?.type) {
            case 'AdditiveOperator':
                operator = this.eat<AdditiveOperatorToken>('AdditiveOperator').value;
                break;
            case 'LogicalNot': 
                operator = this.eat<LogicalNot>('LogicalNot').value;
                break;
        }

        if(operator != null) {
            return {
                type: 'UnaryExpression',
                operator,
                argument: this.UnaryExpression(),
            }
        }

        return this.LeftHandSideExpression();
    }

    /**
     * MultiplicativeExpression
     * : UnaryExpression
     * | MultiplicativeExpression MultiplicativeOperator UnaryExpression
     * ;
     */
    MultiplicativeExpression(): AssignmentExpression {
        return this.BinaryExpression('UnaryExpression', 'MultiplicativeOperator');
    }
    
    /**
     * AdditiveExpression
     * : MultiplicativeExpression
     * ; AdditiveExpression AdditiveOperator MultiplicativeExpression
     */
    AdditiveExpression(): AssignmentExpression {
        return this.BinaryExpression('MultiplicativeExpression', 'AdditiveOperator');
    }

    BinaryExpression<K extends keyof Parser & FunctionOfType<Parser, AssignmentExpression>>(
        builderName: K, tokenType: PropType<OperatorToken, 'type'>) {
            
        const builderMethod = this[builderName].bind(this) as () => AssignmentExpression;
        let left = builderMethod();

        while(this.lookahead?.type === tokenType) {
            // Operator: +, -, *, /
            const operator = this.eat<OperatorToken>(tokenType).value;

            const right = builderMethod();

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            }
        }

        return left;
    }

    eat<T extends Token = Token>(tokenType: TokenType<T>): T {
        const token = this.lookahead;

        if(token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}"`
            )
        }

        if(token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}, expected: "${tokenType}"`
            )
        }

        //Advance to next token.
        this.lookahead = this.tokenizer.getNextToken();

        return token as T;
    }


    /**
     * NullLiteral
     * : 'null'
     * ;
     */
    NullLiteral(): NullLiteral {
        this.eat('null');
        return {
            type: 'NullLiteral',
            value: null
        }
    }

    /**
     * BooleanLiteral
     * : 'true'
     * | 'false'
     * ;
     */
    BooleanLiteral(value: boolean): BooleanLiteral {
        this.eat(value ? 'true' : 'false');
        return {
            type: 'BooleanLiteral',
            value
        }
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
        switch(this.lookahead?.type) {
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
    StringLiteral(): StringLiteral {
        const token = this.eat('String');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    };

    /**
     * NumericLiteral
     * : Number
     * ; 
     */
    NumericLiteral(): NumericLiteral {
        const token = this.eat('Number');
        return {
            type: 'NumericLiteral',
            value: Number(token.value),
        }
    }
}