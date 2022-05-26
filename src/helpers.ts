/** @format */

import { ESLintUtils } from '@typescript-eslint/utils';
import { Expression } from '@typescript-eslint/types/dist/generated/ast-spec';

export const createRule = ESLintUtils.RuleCreator(() => '');

export const isJSXElement = (node?: Expression | null) => {
    return node?.type === 'JSXElement';
};
