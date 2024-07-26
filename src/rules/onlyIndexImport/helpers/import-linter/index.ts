/** @format */

import { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint';
import { ImportDeclaration } from '@typescript-eslint/types/dist/generated/ast-spec';
import path from 'path';

type Context = Readonly<RuleContext<'invalidImport', never[]>>;
export type ImportLinterOptions = {
    context: Context;
    node: ImportDeclaration;
    folders: string[];
};

class ImportLinter {
    private context: Context;
    private node: ImportDeclaration;
    private _filename: string;
    private _importPath: string;
    private folderType: string;
    protected folders: string[];

    constructor(folderType: string, options: ImportLinterOptions) {
        this.context = options.context;
        this.node = options.node;
        this.folderType = folderType;
        this.folders = options.folders;

        this._importPath = this.normalizePath(
            this.resolveImportLocation(this.node.source.value)
        );

        this._filename = this.normalizePath(this.context.getFilename());
    }

    public reportError() {
        this.context.report({
            node: this.node,
            messageId: 'invalidImport',
            data: {
                name: this.node.source.value
            }
        });
    }

    public get filename(): string {
        return this._filename;
    }

    public get importPath(): string {
        return this._importPath;
    }

    public isDeepImport() {
        const { index: lastImportFolder, name: importName } =
            this.getFolderName(this.importPath, true);
        const { index: lastFileFolder, name: fileName } = this.getFolderName(
            // this.filename.replace(/\/[^\/]+\.ts(x)?$/, ''),
            this.filename,
            false
        );

        if (lastImportFolder <= lastFileFolder) {
            return false;
        }

        const isParentFile = fileName === importName;

        return !isParentFile;
    }

    public isImportIntoIndex() {
        // Use filename to determine if the file is an index file
        const isIndexFile = /index\.(ts|tsx)/.test(this.context.getFilename());

        if (!isIndexFile) {
            return false;
        }

        const fileSections = this.filename.split('/');
        const importSections = this.importPath.split('/');

        return fileSections.at(-1) === importSections.at(-2);
    }

    public isSameFolderLevel() {
        const importSections = this.importPath.split('/');
        const fileSections = this.filename
            // .replace(/\/[^\/]+\.ts(x)?$/, '')
            .split('/');

        const lastImportFolder = this.findLastFolderIndex(
            [...importSections],
            this.folders
        );
        const lastFileFolder = this.findLastFolderIndex(
            [...fileSections],
            this.folders
        );

        return lastImportFolder === lastFileFolder;
    }

    public isSameParentFolder() {
        const importParentFolder =
            this.importPath.match(/([^/]+)\/([^/]+)$/)?.[1];
        const fileParentFolder = this.filename.match(/([^/]+)\/([^/]+)$/)?.[1];

        return importParentFolder === fileParentFolder;
    }

    public isIndexImport() {
        const topFoldersRegex = `(${this.folderType})`;
        const foldersRegex = `(${this.folders.join('|')})`;

        const isTopLevelImport = new RegExp(
            `client/${topFoldersRegex}/[^/]+$`
        ).test(this.importPath);

        const isFolderImport = new RegExp(
            `client/${topFoldersRegex}/[^/]+/${foldersRegex}/[^/]+$`
        ).test(this.importPath);

        const isSubFolderImport = new RegExp(
            `client/${topFoldersRegex}/[^/]+/${foldersRegex}/[^/]+/${foldersRegex}`
        ).test(this.importPath);

        return isTopLevelImport || isFolderImport || isSubFolderImport;
    }

    public isSameFolderType() {
        const [_file, fileFolderType, fileFolder] =
            this.filename.match(/client\/([^/]+)\/([^/]+)/) ?? [];

        const [_import, importFolderType, importFolder] =
            this.importPath.match(/client\/([^/]+)\/([^/]+)/) ?? [];

        return (
            fileFolderType === importFolderType && fileFolder === importFolder
        );
    }

    public isTypeLevelImport() {
        return this.importPath.match(/client\/([^/]+)\/[^/]+$/) !== null;
    }

    protected findLastFolderIndex(sections: string[], folders: string[]) {
        let index = -1;

        sections.forEach((section, i) => {
            if (folders.includes(section)) {
                index = i;
            }
        });

        return index;
    }

    protected getFolderName(path: string, isImport: boolean) {
        const sections = path.split('/');

        const folderIndex = this.findLastFolderIndex(
            [...sections],
            this.folders
        );
        if (folderIndex !== -1) {
            const name = isImport
                ? sections[folderIndex - 1]
                : sections[folderIndex + 1];

            return {
                name,
                index: folderIndex
            };
        }

        const folderTypeIndex = this.findLastFolderIndex(
            [...sections],
            [this.folderType]
        );

        if (folderTypeIndex !== -1) {
            return {
                name: sections[folderTypeIndex + 1],
                index: folderTypeIndex
            };
        }

        return {
            name: 'unknown',
            index: -1
        };
    }

    private resolveImportLocation(importPath: string) {
        const isRelativeImport = importPath.startsWith('../');
        const isCloseRelativeImport = importPath.startsWith('./');

        if (isRelativeImport) {
            return path.resolve(this.context.getFilename(), importPath);
        }

        if (isCloseRelativeImport) {
            return path.resolve(this.context.getFilename(), '../', importPath);
        }

        return importPath;
    }

    private normalizePath(path: string) {
        return path
            .replace(/\/index[\.(ts|tsx)]*$/, '')
            .replace(/.+\/(?=client)/, '');
    }
}

export default ImportLinter;
