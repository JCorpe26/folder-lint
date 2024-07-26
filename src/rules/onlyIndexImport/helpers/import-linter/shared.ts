/** @format */

import ImportLinter, { ImportLinterOptions } from './index';

class SharedImportLinter extends ImportLinter {
    constructor(options: ImportLinterOptions) {
        super('shared', options);
    }

    public isTypeLevelImport() {
        const foldersRegex = `(${this.folders.join('|')})`;

        const isTopLevelImport = new RegExp(
            `client/[^/]+/${foldersRegex}/[^/]+$`
        );

        return this.importPath.match(isTopLevelImport) !== null;
    }

    protected getFolderName(path: string, isImport: boolean) {
        const sections = path.split('/');

        const folderIndex = this.findLastFolderIndex(
            [...sections],
            this.folders
        );
        if (folderIndex !== -1) {
            const name = sections[folderIndex];

            return {
                name,
                index: folderIndex
            };
        }

        return {
            name: 'unknown',
            index: -1
        };
    }
}

export default SharedImportLinter;
