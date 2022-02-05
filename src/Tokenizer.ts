type NumberToken = {
    type: 'Number';
    value: string;
}

type StringToken = {
    type: 'String';
    value: string;
}

type SemicolonToken = {
    type: ';';
    value: string;
}

type PropType<T, K extends keyof T> = T[K];

export type Token = 
    | NumberToken 
    | StringToken
    | SemicolonToken;

export type TokenType = PropType<Token, 'type'>;

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

  //-----------------------------
  // Numbers: 
  [ /^\d+/, 'Number' ],

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
                value: tokenValue,
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