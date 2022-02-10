export type NumberToken = {
    type: 'Number';
    value: string;
}

export type StringToken = {
    type: 'String';
    value: string;
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

export type FunctionOfType<T, R> = {
    [K in keyof T]: T[K] extends () => R ? K : never
}[keyof T]


export type PropType<T, K extends keyof T> = T[K];

export type OperatorToken = AdditiveOperatorToken | MultiplicativeOperatorToken

export type Token = 
    | NumberToken 
    | StringToken
    | SemicolonToken
    | OpenCurlyBraceToken
    | CloseCurlyBraceToken
    | OperatorToken
    | OpenParanthesisToken
    | CloseParanthesisToken;


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

  //-----------------------------
  // Math operators +, -, *, /
  [/^[+-]/, 'AdditiveOperator'],
  [/^[*/]/, 'MultiplicativeOperator'],
  //-----------------------------
  // Numbers: 
  [ /^\d+/, 'Number'],

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