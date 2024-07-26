/** @format */
import { ImportDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';

import { createRule } from '@/helpers';
import SharedImportLinter from '@/rules/onlyIndexImport/helpers/import-linter/shared';

const folders = ['components', 'contexts', 'hooks', 'helpers', 'test-utils'];

export default createRule({
    name: 'only-index-import-in-shared',
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
                const linter = new SharedImportLinter({
                    context,
                    node,
                    folders
                });

                const isClientImport = linter.importPath.includes('client/');

                if (!isClientImport) {
                    return;
                }

                const isSharedImport = linter.importPath.includes('shared/');

                if (!isSharedImport) {
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
