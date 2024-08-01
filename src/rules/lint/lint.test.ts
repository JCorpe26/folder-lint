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

ruleTester.run('index', rule, {
    valid: [
        {
            name: 'Wildcard Path',
            code: '',
            filename: 'src/components/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/*'] }]
        },
        {
            name: 'Wildcard Path',
            code: '',
            filename: 'src/components/folder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/*'] }]
        },
        {
            name: 'Wildcard Path, With Exact Folder',
            code: '',
            filename: 'src/components/file.ts',
            options: [
                { baseDir: 'src', allowedPaths: ['components/*/subfolder'] }
            ]
        },
        {
            name: 'Wildcard Path, With Exact Folder',
            code: '',
            filename: 'src/components/folder/file.ts',
            options: [
                { baseDir: 'src', allowedPaths: ['components/*/subfolder'] }
            ]
        },
        {
            name: 'Wildcard Path, With Exact Folder',
            code: '',
            filename: 'src/components/folder/subfolder/file.ts',
            options: [
                { baseDir: 'src', allowedPaths: ['components/*/subfolder'] }
            ]
        },
        {
            name: 'Any Path',
            code: '',
            filename: 'src/components/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/**'] }]
        },
        {
            name: 'Any Path',
            code: '',
            filename: 'src/components/folder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/**'] }]
        },
        {
            name: 'Any Path',
            code: '',
            filename: 'src/components/folder/subfolder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/**'] }]
        },
        {
            name: 'Any Path',
            code: '',
            filename: 'src/components/folder/another_folder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/**'] }]
        },
        {
            name: 'Different Base Directory',
            code: '',
            filename: 'src/components/folder/another_folder/file.ts',
            options: [{ baseDir: 'not_src', allowedPaths: [] }]
        }
    ],
    invalid: [
        {
            name: 'Exact Path',
            code: '',
            filename: 'src/components/folder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components'] }],
            errors: [{ messageId: 'error' }]
        },
        {
            name: 'Exact Path',
            code: '',
            filename: 'src/components/folder/subfolder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components'] }],
            errors: [{ messageId: 'error' }]
        },
        {
            name: 'Wildcard Path',
            code: '',
            filename: 'src/components/folder/subfolder/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/*'] }],
            errors: [{ messageId: 'error' }]
        },
        {
            name: 'Wildcard Path, With Exact Folder',
            code: '',
            filename: 'src/components/folder/another_folder/file.ts',
            options: [
                { baseDir: 'src', allowedPaths: ['components/*]/subfolder'] }
            ],
            errors: [{ messageId: 'error' }]
        },
        {
            name: 'Any Path',
            code: '',
            filename: 'src/something/file.ts',
            options: [{ baseDir: 'src', allowedPaths: ['components/**'] }],
            errors: [{ messageId: 'error' }]
        }
    ]
});
