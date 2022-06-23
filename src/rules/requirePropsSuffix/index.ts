/** @format */

import {
    ArrowFunctionExpression,
    BlockStatement,
    Expression,
    FunctionDeclaration,
    Identifier,
    ReturnStatement
} from '@typescript-eslint/types/dist/generated/ast-spec';

import { createRule, isJSXElement } from '../../helpers';

export default createRule({
    name: 'require-props-suffix',
    meta: {
        type: 'suggestion',
        schema: {},
        docs: {
            description: 'Enforce props to be suffixed with `Props`',
            recommended: 'error'
        },
        messages: {
            notSuffixed: "Not suffixed with 'Props'."
        }
    },
    defaultOptions: [],
    create(context) {
        function isComponentFunction(node: BlockStatement | Expression) {
            // If the body isn't a block statement, it's not a function declaration.
            if (node.type !== 'BlockStatement') {
                return false;
            }

            const returnStatements = node.body.filter(
                (limb) => limb.type === 'ReturnStatement'
            ) as ReturnStatement[];

            // We should only have one return statement in a component
            if (returnStatements.length !== 1) {
                return false;
            }

            const returnStatement = returnStatements[0];

            // If the return statement is a JSXElement, then it is a valid component.
            if (isJSXElement(returnStatement?.argument)) {
                return true;
            }

            // If it is a conditional, make sure one of the sides is a JSX element
            // e.g. return variable ? null : <div>test</div>;
            if (returnStatement?.argument?.type === 'ConditionalExpression') {
                return (
                    isJSXElement(returnStatement?.argument?.consequent) ||
                    isJSXElement(returnStatement?.argument?.alternate)
                );
            }

            // If it logical, make sure one of the sides is a JSX element
            // e.g. return false && <div>test</div>
            if (returnStatement?.argument?.type === 'LogicalExpression') {
                return (
                    isJSXElement(returnStatement?.argument?.left) ||
                    isJSXElement(returnStatement?.argument?.right)
                );
            }

            return false;
        }

        function getPropsType(
            node: FunctionDeclaration | ArrowFunctionExpression
        ) {
            const { params } = node;
            const props = params?.[0];

            if (!props || props.type !== 'ObjectPattern') {
                return;
            }

            const typeAnnotation = props.typeAnnotation;

            if (!typeAnnotation) {
                return;
            }

            const typeReference = typeAnnotation?.typeAnnotation;

            if (typeReference?.type !== 'TSTypeReference') {
                return;
            }

            if (typeReference.typeName.type !== 'Identifier') {
                return;
            }

            return typeReference.typeName;
        }

        return {
            // function ({ ... }: ComponentProps) {}
            'Program > FunctionDeclaration ': (node: FunctionDeclaration) => {
                if (!isComponentFunction(node.body)) {
                    return;
                }
                const propsType = getPropsType(node);
                if (propsType && !propsType.name.endsWith('Props')) {
                    context.report({
                        messageId: 'notSuffixed',
                        node: propsType
                    });
                }
            },
            // FunctionComponent<ComponentProps>
            'Program > VariableDeclaration > VariableDeclarator > Identifier TSTypeReference[typeName.name=/FunctionComponent|FC/] TSTypeParameterInstantiation > TSTypeReference > Identifier':
                (node: Identifier) => {
                    if (!node.name.endsWith('Props')) {
                        context.report({
                            messageId: 'notSuffixed',
                            node: node
                        });
                    }
                },
            // const Component = ({ ... }: ComponentProps) => {}
            'Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression':
                (node: ArrowFunctionExpression) => {
                    if (!isComponentFunction(node.body)) {
                        return;
                    }

                    const propsType = getPropsType(node);

                    if (propsType && !propsType.name.endsWith('Props')) {
                        context.report({
                            messageId: 'notSuffixed',
                            node: propsType
                        });
                    }
                }
        };
    }
});
