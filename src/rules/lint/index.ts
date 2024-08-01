/** @format */
import { Program } from '@typescript-eslint/types/dist/generated/ast-spec';

import { createRule } from '../../helpers';

export default createRule({
    name: 'index',
    meta: {
        type: 'problem',
        docs: {
            description: 'Invalid folder for file.',
            recommended: 'error'
        },
        schema: {},
        messages: {
            error: 'Invalid folder for file.'
        }
    },
    defaultOptions: [{ baseDir: 'src', allowedPaths: ['components/*'] }],
    create(context) {
        const { baseDir, allowedPaths } = context.options[0];

        // Remove file from filename
        const filename = context.getFilename().replace(/(\/[^/]+)$/, '');

        const baseDirRegex = new RegExp(`.*?${baseDir}/`);
        const filenameWithoutBaseDir = filename.replace(baseDirRegex, '');

        function isAllowed(pathPart: string, filenamePart: string) {
            if (
                pathPart === '*' ||
                pathPart === '**' ||
                pathPart === undefined
            ) {
                return true;
            }

            return filenamePart === pathPart;
        }

        function isAllowedPath(path: string) {
            const splitFilename = filenameWithoutBaseDir.split('/');
            const splitPath = path.split('/');

            const isValid = splitFilename.reduce(
                (isValid, filenamePart, index) => {
                    const pathPart = splitPath[index];

                    const allowed = isAllowed(pathPart, filenamePart);

                    return isValid && allowed;
                },
                true
            );

            if (!isValid) {
                return false;
            }

            if (
                !path.includes('**') &&
                splitFilename.length > splitPath.length
            ) {
                return false;
            }

            return true;
        }

        return {
            Program: (node: Program) => {
                if (!filename.includes(baseDir)) {
                    return;
                }

                const isAllowedFile = allowedPaths.reduce(
                    (isAllowed, allowPath) => {
                        return isAllowed || isAllowedPath(allowPath);
                    },
                    false
                );

                if (!isAllowedFile) {
                    context.report({
                        loc: {
                            start: { line: 1, column: 1 },
                            end: { line: 1, column: 100 }
                        },
                        messageId: 'error'
                    });
                }
            }
        };
    }
});
