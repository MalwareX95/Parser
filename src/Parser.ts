import { AssignToken, ComplexAssignToken, FunctionOfType, IdentifierToken, OperatorToken, PropType, ReturnTypeOfParserKey, SimpleAssignToken, Token, Tokenizer, TokenType } from "./Tokenizer";

type Literal = ReturnTypeOfParserKey<'Literal'>
type LeftHandSideExpression = ReturnTypeOfParserKey<'LeftHandSideExpression'>
type Statement = ReturnTypeOfParserKey<'Statement'>
type StatementList = Statement[];

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

type AssignmentExpression = 
| BinaryExpression
| {
    type: 'AssignmentExpression';
    operator: PropType<AssignToken, 'value'>;
    left: AssignmentExpression;
    right: AssignmentExpression;
}

type BinaryExpression = 
| Literal
| LeftHandSideExpression
| {
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
     * VariableStatement
     * : 'let' VariableDeclarationList ';'
     * ;
     */
    VariableStatement(): VariableStatement {
        this.eat('let');
        const declarations = this.VariableDeclarationList();
        this.eat(';');

        return {
            type: 'VariableStatement',
            declarations,
        }
    }

    /**
     * Statement
     * : ExpressionStatement
     * | BlockStatement
     * | EmptyStatement
     * | VariableStatement
     * ;
     */
    Statement() {
        switch(this.lookahead?.type) {
            case ';': 
                return this.EmptyStatement();
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

    CheckValidAssignmentTarget(node: AssignmentExpression): Identifier {
        if(node.type === 'Identifier') {
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
     * : Identifier
     */
    LeftHandSideExpression() {
        return this.Identifier();
    }


    /**
     * Whether the token is an assignment operator.
     */

     IsAssignmentOperator(tokenType?: TokenType) {
        return tokenType === 'SimpleAssign' || tokenType === 'ComplexAssign';
     }

    /**
     * AssignmentExpression
     * : AdditiveExpression
     * | LeftHandSideExpression AssignmentOperator AssignmentExpression //Right recursion
     * ;
     */
    AssignmentExpression(): AssignmentExpression {
        const left = this.AdditiveExpression();

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
        if (this.IsLiteral(this.lookahead?.type)) {
            return this.Literal();
        }

        switch(this.lookahead?.type) {
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
    MultiplicativeExpression(): AssignmentExpression {
        return this.BinaryExpression('PrimaryExpression', 'MultiplicativeOperator');
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

    Literal() {
        switch(this.lookahead?.type) {
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