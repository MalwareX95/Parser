import { TestCase } from "./literals-test";

export default (test: TestCase) => {
    test(';', {
        type: 'Program',
        body: [
            {
                type: 'EmptyStatement',
            }
        ]
    })      
}