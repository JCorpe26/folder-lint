/** @format */
import {
    BlockStatement,
    Identifier,
    JSXOpeningElement,
    TSIndexedAccessType,
    TSPropertySignature,
    TSTypeAliasDeclaration,
    TSTypeAnnotation,
    TSTypeLiteral,
    TSTypeReference
} from '@typescript-eslint/types/dist/generated/ast-spec';

import { createRule } from '../../helpers';

export default createRule({
    name: 'prop-type-aliases-only-to-children',
    meta: {
        type: 'problem',
        docs: {
            description:
                'In the components type definition, if using a child component prop type, only allow it to be passed to the component it was imported from or check if the prop has been defined.',
            recommended: 'error'
        },
        schema: {},
        messages: {
            notValidUse:
                'Not a valid use of {{name}}. It can only be passed to children as a prop or be checked if it is defined.'
        }
    },
    defaultOptions: [],
    create(context) {
        const source = context.getSourceCode().ast;

        const tree = source.body;

        const componentPropTypes = tree.filter((branch) => {
            return (
                branch.type === 'TSTypeAliasDeclaration' &&
                branch.id.name.includes('Props')
            );
        }) as TSTypeAliasDeclaration[];

        if (componentPropTypes.length === 0) {
            return {};
        }

        const propTypes = componentPropTypes
            .map(
                (propType) => (propType.typeAnnotation as TSTypeLiteral).members
            )
            .flat()
            .filter(Boolean);

        const propsUsingPropAliases = propTypes
            .filter((prop) => {
                // TSPropertySignature > TSIndexedAccessType > TSTypeReference > Identifier
                if (prop.type !== 'TSPropertySignature') {
                    return;
                }

                const { typeAnnotation: propTypeAnnotation } = prop;

                if (!propTypeAnnotation) {
                    return;
                }

                const { typeAnnotation } = propTypeAnnotation;

                if (typeAnnotation.type !== 'TSIndexedAccessType') {
                    return;
                }

                const objectType = typeAnnotation.objectType;

                if (objectType.type !== 'TSTypeReference') {
                    return;
                }

                if (objectType.typeName.type !== 'Identifier') {
                    return;
                }

                // e.g. ButtonProps['size']
                return objectType.typeName.name.includes('Props');
            })
            .map((prop) => {
                const { key, typeAnnotation: propTypeAnnotation } =
                    prop as TSPropertySignature;

                const { typeAnnotation } =
                    propTypeAnnotation as TSTypeAnnotation;

                const { objectType } = typeAnnotation as TSIndexedAccessType;

                const { typeName } = objectType as TSTypeReference;

                return {
                    name: (key as Identifier).name,
                    type: (typeName as Identifier).name
                };
            });

        if (propsUsingPropAliases.length === 0) {
            return {};
        }

        function isComponent(componentName: string, node: JSXOpeningElement) {
            if (node.type !== 'JSXOpeningElement') {
                return false;
            }

            const { name } = node;

            if (name.type !== 'JSXIdentifier') {
                return false;
            }

            return name?.name === componentName;
        }

        return {
            'ArrowFunctionExpression > BlockStatement': (
                node: BlockStatement
            ) => {
                const scope = context.getScope();

                propsUsingPropAliases.forEach((prop) => {
                    const variable = scope.set.get(prop.name);

                    if (!variable) {
                        return;
                    }

                    const invalidReferences = variable.references.filter(
                        (ref) => {
                            const identifier = ref.identifier;

                            if (!identifier.parent) {
                                return;
                            }

                            // Props can only be assigned when having default values set.
                            const isAssignment =
                                identifier.parent.type === 'AssignmentPattern';

                            if (isAssignment) {
                                return false;
                            }

                            // Still allow it to be used in JSXAttributes for the component.
                            const isJSXAttribute =
                                identifier.parent.type ===
                                    'JSXExpressionContainer' &&
                                identifier.parent.parent?.type ===
                                    'JSXAttribute' &&
                                identifier.parent.parent?.parent?.type ===
                                    'JSXOpeningElement';

                            // ButtonProps -> Button
                            const componentName = prop.type.replace(
                                'Props',
                                ''
                            );

                            const jsxOpeningElement = identifier.parent?.parent
                                ?.parent as JSXOpeningElement;

                            if (
                                isJSXAttribute &&
                                isComponent(componentName, jsxOpeningElement)
                            ) {
                                return false;
                            }

                            // Allow it to be used in logic, as long as it isn't evaluating it (===, >, < etc)
                            // and only checking if it is defined.
                            const isLogicalExpression =
                                identifier.parent.type ===
                                    'LogicalExpression' &&
                                ['&&', '||'].includes(
                                    identifier.parent.operator
                                );

                            if (isLogicalExpression) {
                                return false;
                            }

                            // Allow it to be used in a turnery operator. A turnery operator will only have a parent
                            // of ConditionalExpression when it doesn't have any logic in it. e.g. `foo ? bar : baz`
                            // As soon as it does, it'll have another layer between ConditionalExpression and the Identifier.
                            if (
                                identifier.parent.type ===
                                'ConditionalExpression'
                            ) {
                                return false;
                            }

                            // Allow it to be used in if statements. An if statement will only be the parent
                            // if it is not evaluating anything else e.g. if (prop) [works] vs if (prop === 'foo') [errors]
                            const isIfStatement =
                                identifier.parent.type === 'IfStatement';

                            if (isIfStatement) {
                                return false;
                            }

                            return true;
                        }
                    );

                    invalidReferences.forEach((ref) => {
                        const identifier = ref.identifier;

                        context.report({
                            messageId: 'notValidUse',
                            data: { name: identifier.name },
                            node: identifier
                        });
                    });
                });
            }
        };
    }
});
