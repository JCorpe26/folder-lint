/** @format */

import { ESLintUtils } from '@typescript-eslint/utils';
import rule from './index';

const ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        }
    }
});

ruleTester.run('require-props-suffix', rule, {
    valid: [
        {
            code: `const Component = ({ data }) => { 
                return <div></div>; 
            }`
        },
        {
            code: `const Component = ({ data }: RandomProps) => { 
                return <div></div>; 
            }`
        },
        {
            code: `const Component: FunctionComponent<RandomProps> = ({ data }) => { 
                return <div></div>; 
            }`
        },
        {
            code: `const Component: FC<RandomProps> = ({ data }) => { 
                return <div></div>; 
            }`
        },
        {
            code: `const Function = ({ data }: RandomType) => { 
                return data; 
            }`
        },
        {
            code: `const Function = (data: RandomType) => { 
                return data; 
            }`
        },
        {
            code: `function Component ({ data }: RandomProps) {
                return <div></div>;
            }`
        },
        {
            code: `function Function ({ data }: RandomType) {
                return data;
            }`
        },
        {
            code: `function Function (data: RandomType) {
                return data;
            }`
        }
    ],
    invalid: [
        {
            code: `const Component = ({ data }: RandomType) => {
                return <div></div>;
            }`,
            errors: [{ messageId: 'notSuffixed' }]
        },
        {
            code: `const Component: FunctionComponent<RandomType> = ({ data }) => { 
                return <div></div>; 
            }`,
            errors: [{ messageId: 'notSuffixed' }]
        },
        {
            code: `function Component ({ data }: RandomType) {
                return <div></div>;
            }`,
            errors: [{ messageId: 'notSuffixed' }]
        }
    ]
});
