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

export type KeywordToken =
    | LetKeywordToken
    | IfKeywordToken
    | ElseKeywordToken

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

export type Token = 
    | NumberToken 
    | StringToken
    | SemicolonToken
    | OpenCurlyBraceToken
    | CloseCurlyBraceToken
    | OperatorToken
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

  //-----------------------------
  // Numbers: 
  [ /^\d+/, 'Number'],

  //-----------------------------
  // Identifiers:
  [/^\w+/, 'Identifier'],

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