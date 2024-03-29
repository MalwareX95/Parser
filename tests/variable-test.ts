import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    // Simple variable declaration: 
    test(`let x = 42;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: {
                            type: 'NumericLiteral',
                            value: 42
                        }
                    }
                ]
            }
        ]
    })

    // Variable declaration, no init:
    test(`let x;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    }
                ]
            }
        ]
    })

    // Multiple variable declarations, no init:
    test(`let x, y;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    },
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        init: null
                    }
                ]
            }
        ]
    })

    // Multiple variable declarations
    test(`let x, y = 42;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    },
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        init: {
                            type: 'NumericLiteral',
                            value: 42,
                        }
                    }
                ]
            }
        ]
    })
}