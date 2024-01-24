/** @format */
import { ImportDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';

import { createRule } from '../../helpers';

export default createRule({
    name: 'no-feature-import',
    meta: {
        type: 'problem',
        docs: {
            description:
                "Prevents the use of feature imports in files that aren't within the feature",
            recommended: 'error'
        },
        schema: {},
        messages: {
            invalidImport: `{{ name }} is not a valid import for this file. You cannot import from other features.`
        }
    },
    defaultOptions: [],
    create(context) {
        const filename = context.getFilename();

        function getFeature(path: string) {
            const importSections = path.split('/');
            const featureIndex = importSections.findIndex(
                (path) => path === 'features'
            );

            if (featureIndex === -1) {
                return;
            }

            const featureName = importSections[featureIndex + 1];

            return featureName;
        }

        return {
            ImportDeclaration: (node: ImportDeclaration) => {
                const importPath = node.source.value as string;

                const isRelativeImport = importPath.startsWith('./');
                if (isRelativeImport) {
                    return;
                }

                const hasFeature = importPath.includes('features/');
                if (!hasFeature) {
                    return;
                }

                const isViewFolder = filename.includes('views/');
                if (isViewFolder) {
                    return;
                }

                const fileNameFeature = getFeature(filename);
                const importFeature = getFeature(importPath);

                if (
                    (importFeature && !fileNameFeature) ||
                    importFeature !== fileNameFeature
                ) {
                    context.report({
                        node,
                        messageId: 'invalidImport',
                        data: {
                            name: importFeature
                        }
                    });
                }
            }
        };
    }
});
