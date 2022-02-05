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
    type: 'ExpressionStatement',
    expression: Expression
}

type Statement = ExpressionStatement

type StatementList = Statement[]

export type Program = {
    type: 'Program';
    body: StatementList;
}

export class Parser {
    str = '';

    tokenizer = new Tokenizer();

    lookahead?: Token | null;

    parse(str: string): Program {
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
     * : NumericLiteral
     * ;
     */
    Program(): Program {
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
    StatementList(): StatementList {
        const statementList: StatementList = [ this.Statement() ]
        
        while(this.lookahead) {
            statementList.push(this.Statement())
        }

        return statementList;
    }

    /**
     * Statement
     * : ExpressionStatement
     * ;
     */
    Statement(): Statement {
        return this.ExpressionStatement();
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

    /**
     * Expression
     * : Literal
     * ;
     */
    Expression(): Expression {
        return this.Literal();
    }

    Literal(): Literal {
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
    StringLiteral(): StringLiteral {
        const token = this.eat('String');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        }
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