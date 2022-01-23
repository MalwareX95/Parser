type NumericLiteral = {
    type: 'NumericLiteral';
    value: number;
}

type Program = NumericLiteral;


export class Parser {
    str = '';

    parse(str: string): Program {
        this.str = str;
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
        return this.NumericLiteral();
    }

    /**
     * NumericLiteral
     * : Number
     * ; 
     */
    NumericLiteral(): NumericLiteral {
        return {
            type: 'NumericLiteral',
            value: Number(this.str),
        }
    }
}