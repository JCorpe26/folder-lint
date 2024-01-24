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

ruleTester.run('no-feature-import', rule, {
    valid: [
        {
            // Allow imports from the shared folder.
            code: `
                import { Component } from 'src/shared/Component';
            `,
            filename: 'src/features/feature-1/Component.tsx'
        },
        {
            // Allow relative imports
            code: `
                import { Component } from './Component';
            `,
            filename: 'src/features/feature-1/Component.tsx'
        },
        {
            // Allow imports from the same feature
            code: `
                import { Component } from 'src/features/feature-1/Component';
            `,
            filename: 'src/features/feature-1/Component.tsx'
        },
        {
            // Allow imports of features into views
            code: `
                import { Component } from 'src/features/feature-1/Component';
            `,
            filename: 'src/views/view-1/Component.tsx'
        },
        {
            // Make sure imports outside of features still work
            code: `
                import { Component } from 'src/shared/Component';
                import { Component } from './Component';
                import { Component } from '../Component';
            `,
            filename: 'src/views/view-1/Component.tsx'
        }
    ],
    invalid: [
        {
            // Don't allow imports from other features
            code: `
                import { Component } from 'src/features/feature-2/Component';
            `,
            filename: 'src/features/feature-1/Component.tsx',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            // Don't allow imports of features into shared
            code: `
                import { Component } from 'src/features/feature-1/Component';
            `,
            filename: 'src/shared/component/Component.tsx',
            errors: [{ messageId: 'invalidImport' }]
        },
        {
            // Don't allow imports of features into random files
            code: `
                import { Component } from 'src/features/feature-1/Component';
            `,
            filename: 'src/random/Component.tsx',
            errors: [{ messageId: 'invalidImport' }]
        }
    ]
});
