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

ruleTester.run('only-index-import-in-shared', rule, {
    valid: [
        {
            name: 'Can import components from the same level',
            code: `import { C } from 'client/shared/components/<component-2>'`,
            filename: 'client/shared/components/<component>/index.ts'
        },
        {
            name: 'Can import non-index file from the same folder',
            code: `import { C } from 'client/shared/components/<component>/types'`,
            filename: 'client/shared/components/<component>/index.ts'
        },
        {
            name: 'Can import non-index file into another non-index file from the same folder',
            code: `import { C } from 'client/shared/components/<component>/types'`,
            filename: 'client/shared/components/<component>/test.ts'
        },
        {
            name: 'Can import a file from a folder',
            code: `import { C } from 'client/shared/components/<component>'`,
            filename:
                'client/shared/components/<component-2>/components/<component>/index.ts'
        },
        {
            name: 'Can import multiple levels down from the same folder',
            code: `import { C } from 'client/shared/components/<component>/components/<component-2>'`,
            filename: 'client/shared/components/<component>/index.ts'
        },
        {
            name: 'Can import relative file from the same folder',
            code: `import { C } from './components/booking-details'`,
            filename: 'client/shared/components/<component>/index.tsx'
        },
        {
            name: 'Can import from shared into another folder type: view',
            code: `import { C } from 'client/shared/components/<component>'`,
            filename: 'client/views/<view>/index.ts'
        },
        {
            name: 'Can import from shared into another folder type: feature',
            code: `import { C } from 'client/shared/components/<component>'`,
            filename: 'client/features/<feature>/index.ts'
        }
    ],
    invalid: [
        {
            name: 'Cannot import non-index file from parent folder',
            code: `import { C } from 'client/shared/components/<component>/types'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import non-index file from another folder',
            code: `import { C } from 'client/shared/components/<component>/types'`,
            filename: 'client/shared/components/<component-2>/types',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import non-index file from another deep folder type',
            code: `import { C } from 'client/shared/components/<component>/components/<component>types'`,
            filename: 'client/shared/components/<component-2>/types',
            errors: [{ messageId: 'invalidImport' }]
        }
    ]
});
