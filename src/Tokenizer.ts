type NumberToken = {
    type: 'Number';
    value: string;
}

type StringToken = {
    type: 'String';
    value: string;
}

type PropType<T, K extends keyof T> = T[K];

export type Token = 
    | NumberToken 
    | StringToken;

export type TokenType = PropType<Token, 'type'>;

export class Tokenizer {
    str = '';
    cursor = 0;

    init(str: string) {
        this.str = str;   
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

        /**
         * Numbers 
         */
        if(!Number.isNaN(Number(this.str[this.cursor]))){
            let number = '';

            while(!Number.isNaN(Number(this.str[this.cursor]))) {
                number += this.str[this.cursor++];
            }

            return {
                type: 'Number',
                value: number,
            }
        }

        /**
         * String
         */
        if(this.str[this.cursor] === '"') {
            let s = '';
            do {
                s += this.str[this.cursor++];
            } while(this.str[this.cursor] !== '"' && !this.isEOF());
            s+= this.str[this.cursor++]; // skip

            return {
                type: 'String',
                value: s,
            }
        }


        return null;
    }
}