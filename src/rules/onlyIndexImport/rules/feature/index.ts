/** @format */
import { ImportDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';

import ImportLinter from '@/rules/onlyIndexImport/helpers/import-linter';
import { createRule } from '@/helpers';

const folders = [
    'components',
    'contexts',
    'skeletons',
    'hooks',
    'helpers',
    'test-utils'
];

export default createRule({
    name: 'only-index-import-in-feature',
    meta: {
        type: 'problem',
        docs: {
            description:
                'Prevents the import of anything other than index files',
            recommended: 'error'
        },
        schema: {},
        messages: {
            invalidImport: `{{ name }} is not a valid import for this file. You can only import from an index file.`
        }
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration: (node: ImportDeclaration) => {
                const linter = new ImportLinter('features', {
                    context,
                    node,
                    folders
                });

                const isClientImport = linter.importPath.includes('client/');

                if (!isClientImport) {
                    return;
                }

                const isFeatureImport = linter.importPath.includes('features/');

                if (!isFeatureImport) {
                    return;
                }

                if (!linter.isSameFolderType() && linter.isTypeLevelImport()) {
                    return;
                }

                if (!linter.isSameFolderType()) {
                    return linter.reportError();
                }

                if (linter.isDeepImport()) {
                    return linter.reportError();
                }

                if (linter.isImportIntoIndex() && linter.isSameFolderLevel()) {
                    return;
                }

                if (linter.isSameParentFolder()) {
                    return;
                }

                const isTestUtilsImport = /\/test-utils/.test(
                    linter.importPath
                );
                if (isTestUtilsImport) {
                    return;
                }

                if (!linter.isIndexImport()) {
                    return linter.reportError();
                }
            }
        };
    }
});
