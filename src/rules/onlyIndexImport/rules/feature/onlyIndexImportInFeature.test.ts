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

ruleTester.run('only-index-import-in-feature', rule, {
    valid: [
        {
            name: 'Can import index file from parent folder',
            code: `import { C } from 'client/features/<feature>'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts'
        },
        {
            name: 'Can import components from the same level',
            code: `import { C } from 'client/features/<feature>/components/<component-2>'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts'
        },
        {
            name: 'Can import non-index file from the same folder',
            code: `import { C } from 'client/features/<feature>/components/<component>/types'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts'
        },
        {
            name: 'Can import non-index file into another non-index file from the same folder',
            code: `import { C } from 'client/features/<feature>/components/<component>/types'`,
            filename: 'client/features/<feature>/components/<component>/test.ts'
        },
        {
            name: 'Can import a file from a folder',
            code: `import { C } from 'client/features/<feature>/components/<component>'`,
            filename:
                'client/features/<feature>/components/<component-2>/components/<component>/index.ts'
        },
        {
            name: 'Can import multiple levels down from the same folder',
            code: `import { C } from 'client/features/<feature>/components/<component>/components/<component-2>'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts'
        },
        {
            name: 'Can import relative file from the same folder',
            code: `import { C } from './components/booking-details'`,
            filename:
                'client/features/<feature>/components/<component>/index.tsx'
        },
        {
            name: 'Can import relative file from the same folder type',
            code: `import { C } from './components/booking-details'`,
            filename: 'client/features/<feature>/index.tsx'
        },
        {
            name: 'Can import from feature into another folder type',
            code: `import { C } from 'client/features/<feature>'`,
            filename: 'client/views/<feature>/index.ts'
        }
    ],
    invalid: [
        {
            name: 'Cannot import from multiple levels down',
            code: `import { C } from 'client/features/<feature>/components/<component>/components/<component>/index.ts'`,
            filename: 'client/features/<feature>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import from multiple levels down from a different folder',
            code: `import { C } from 'client/features/<feature>/components/<component-2>/components/<component>/index.ts'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import non-index file from parent folder',
            code: `import { C } from 'client/features/<feature>/types'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import non-index file from the same level',
            code: `import { C } from 'client/features/<feature>/components/<component-2>/types'`,
            filename:
                'client/features/<feature>/components/<component>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import non-index file into another non-index file from a different folder',
            code: `import { C } from 'client/features/<feature>/components/<component-2>/types'`,
            filename:
                'client/features/<feature>/components/<component>/test.ts',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            name: 'Cannot import from deep feature folder into another folder type',
            code: `import { C } from 'client/features/<feature>/components/<component>'`,
            filename: 'client/views/<feature>/index.ts',
            errors: [{ messageId: 'invalidImport' }]
        }
    ]
});
