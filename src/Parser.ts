import { Token, Tokenizer, TokenType } from "./Tokenizer";

type NumericLiteral = {
    type: 'NumericLiteral';
    value: number;
}

type StringLiteral = {
    type: 'StringLiteral';
    value: string;
}

type Literal =
    | NumericLiteral
    | StringLiteral

type Expression = Literal

type ExpressionStatement = {
    type: 'ExpressionStatement';
    expression: Expression;
}

type BlockStatement = {
   type: 'BlockStatement';
   body: StatementList; 
}

type EmptyStatement = {
    type: 'EmptyStatement';
}

type Statement = 
    | ExpressionStatement
    | BlockStatement
    | EmptyStatement

type StatementList = Statement[]

export type Program = {
    type: 'Program';
    body: StatementList;
}

//----------------------------------
// Default AST node factories

const DefaultFactory = {
    Program(body: any): Program {
        return {
            type: 'Program',
            body
        }
    },

    EmptyStatement(): EmptyStatement {
        return {
            type: 'EmptyStatement',
        }
    },

    BlockStatement(body: any): BlockStatement {
        return {
            type: 'BlockStatement',
            body
        };
    },

    ExpressionStatement(expression: any): ExpressionStatement {
        return {
            type: 'ExpressionStatement',
            expression
        }
    },

    StringLiteral(value: string): StringLiteral {
        return {
            type: 'StringLiteral',
            value
        }
    },

    NumericLiteral(value: number): NumericLiteral {
        return {
            type: 'NumericLiteral',
            value,
        }
    }
}

//----------------------------------
// S-expression AST node factories 

const SExpressionFactory = {
    Program(body: any) {
        return ['begin', body];
    },

    EmptyStatement() {},

    BlockStatement(body: any) {
        return ['begin', body]
    },

    ExpressionStatement(expression: any) {
        return expression;
    },

    StringLiteral(value: string) {
        return `"${value}"`;
    },

    NumericLiteral(value: number){
        return value;
    }
}

const AST_MODE: string = 's-expression';

const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory;

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
        return factory.Program(this.StatementList());
    }

    /**
     * StatementList
     * : Statement
     * | StatementList Statement -> Statement Statement Statement Statement
     * ;
     */
    StatementList(stopLookaheadType?: TokenType) {
        const statementList = [ this.Statement() ]
        
        while(this.lookahead && this.lookahead.type !== stopLookaheadType) {
            statementList.push(this.Statement())
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
        switch(this.lookahead?.type) {
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
        this.eat('{');
        const body: any = this.lookahead?.type !== '}' ? this.StatementList('}') : [];
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
        switch(this.lookahead?.type) {
            case 'Number': 
                return this.NumericLiteral();
            case 'String': 
                return this.StringLiteral();
        }

        throw new SyntaxError(`Literal: unexpected literal production`);
    }

    eat(tokenType: TokenType): Token {
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

        return token;
    }


    /**
     * StringLiteral
     * : String
     * ; 
     */
    StringLiteral(){
        const token = this.eat('String');
        return factory.StringLiteral(token.value.slice(1, -1));
    };

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