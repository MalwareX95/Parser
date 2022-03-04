import { Parser } from "./Parser"

export type NumberToken = {
    type: 'Number';
    value: string;
}

export type StringToken = {
    type: 'String';
    value: string;
}

export type LetKeywordToken = {
    type: 'let';
    value: 'let';
}

export type IfKeywordToken = {
    type: 'if';
    value: 'if';
}

export type ElseKeywordToken = {
    type: 'else';
    value: 'else';
}

export type TrueKeywordToken = {
    type: 'true';
    value: 'true';
}

export type FalseKeywordToken = {
    type: 'false';
    value: 'false';
}

export type NullKeywordToken = {
    type: 'null';
    value: 'null';
}

export type KeywordToken =
    | LetKeywordToken
    | IfKeywordToken
    | ElseKeywordToken
    | TrueKeywordToken
    | FalseKeywordToken
    | NullKeywordToken

export type CommaToken = {
    type: ',';
    value: ',';
}

export type SemicolonToken = {
    type: ';';
    value: ';';
}

export type AdditiveOperatorToken = {
    type: 'AdditiveOperator';
    value: '+' | '-';
}

export type MultiplicativeOperatorToken = {
    type: 'MultiplicativeOperator';
    value: '*' | '\\'
}

export type RelationalOperatorToken = {
    type: 'RelationalOperator';
    value: '>' | '>=' | '<' | '<='
}

export type LogicalAndOperator = {
    type: 'LogicalAnd',
    value: '&&'
}

export type LogicalOrOperator = {
    type: 'LogicalOr',
    value: '||'
}

export type LogicalNot = {
    type: 'LogicalNot',
    value: '!',
}

export type UnaryOperatorToken = 
    | AdditiveOperatorToken
    | LogicalNot

export type LogicalOperator = 
    | LogicalAndOperator
    | LogicalOrOperator

export type EqualityOperatorToken = {
    type: 'EqualityOperator';
    value: '==' | '!='
}

export type OpenCurlyBraceToken = {
    type: '{';
    value: '{';
}

export type CloseCurlyBraceToken = {
    type: '}';
    value: '}';
}

export type OpenParanthesisToken = {
    type: '(';
    value: '(';
}

export type CloseParanthesisToken = {
    type: ')';
    value: ')';
}

export type IdentifierToken = {
    type: 'Identifier';
    value: string;
}

export type SimpleAssignToken = {
    type: 'SimpleAssign';
    value: '=';
}

export type ComplexAssignToken = {
    type: 'ComplexAssign';
    value: '*=' | '/=' | '-=' | '+='
}

export type AssignToken = 
    | SimpleAssignToken
    | ComplexAssignToken

export type FunctionOfType<T, R> = {
    [K in keyof T]: T[K] extends () => R ? K : never
}[keyof T]


export type OnlyFunctionKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

export type ReturnTypeOfKey<T, K extends keyof T & OnlyFunctionKeys<T>> = T[K] extends (...args: any) => infer R ? R : never;
export type FunctionType<T, K extends keyof T & OnlyFunctionKeys<T>> = T[K] extends () => infer R ? () => R : never;

export type ReturnTypeOfParserKey<K extends keyof Parser & OnlyFunctionKeys<Parser>> = ReturnTypeOfKey<Parser, K>


export type PropType<T, K extends keyof T> = T[K];

export type OperatorToken = 
    | AdditiveOperatorToken 
    | MultiplicativeOperatorToken
    | RelationalOperatorToken
    | EqualityOperatorToken

export type Token = 
    | NumberToken 
    | StringToken
    | SemicolonToken
    | OpenCurlyBraceToken
    | CloseCurlyBraceToken
    | OperatorToken
    | LogicalOperator
    | UnaryOperatorToken
    | OpenParanthesisToken
    | CloseParanthesisToken
    | IdentifierToken
    | SimpleAssignToken
    | ComplexAssignToken
    | KeywordToken
    | CommaToken
    ;


export type TokenValue<T extends Token> = T['value']

export type TokenType<T extends Token = Token> = PropType<T, 'type'>;


const Spec: [RegExp, TokenType?][] = [
  //-----------------------------
  // Whitespace:
  [ /^\s+/],

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

  //-----------------------------
  // Keywords:
  [/^\blet\b/, 'let'],
  [/^\bif\b/, 'if'],
  [/^\belse\b/, 'else'],
  [/^\btrue\b/, 'true'],
  [/^\bfalse\b/, 'false'],
  [/^\bnull\b/, 'null'],
  //-----------------------------
  // Numbers: 
  [ /^\d+/, 'Number'],

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
  [ /^"[^"]*"/, 'String' ],
  [ /^'[^']*'/, 'String' ]
];

export class Tokenizer {
    str = '';
    cursor = 0;

    init(str: string) {
        this.str = str;
        this.cursor = 0;   
    }

    isEOF() {
        return this.cursor === this.str.length;
    }

    hasMoreTokens() {
        return this.cursor < this.str.length;
    }

    getNextToken(): Token | null {
        if(!this.hasMoreTokens()) {
            return null;
        }

        const string = this.str.slice(this.cursor);

        for (const [ regex, tokenType ] of Spec) {
            const tokenValue = this.match(regex, string);

            // Couldn't match this rule, continue.
            if(tokenValue == null) {
                continue;
            }

            // Should skip token, e.g whitespace.
            if(tokenType == null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue as any,
            }
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }

    /**
     * Matches a token for regular expression 
     */
    match(regex: RegExp, str: string): string | null {
        const matched = regex.exec(str);
        if(!matched){
            return null;
        }
        
        this.cursor += matched[0].length;
        return matched[0];
    }
}