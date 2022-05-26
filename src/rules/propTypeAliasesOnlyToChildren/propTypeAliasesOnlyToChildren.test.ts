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

ruleTester.run('prop-type-aliases-only-to-children', rule, {
    valid: [
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return <Child data={data} />
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return <Child />
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data ? <Child /> : null;
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data && true ? <Child /> : null;
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data || true ? <Child /> : null;
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data ? true : false;
                    return <Child />;
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data && <Child />;
                }
            `
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data && true;
                    return <Child />;
                }
            `
        }
    ],
    invalid: [
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return <OtherComponent data={data} />
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const variable = data;
                    return <Child />
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data > 0 ? <Child /> : null;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data < 0 ? <Child /> : null;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data === 0 ? <Child /> : null;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data == 0 ? <Child /> : null;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data === 0 ? true : false;
                    return <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data == 0 ? true : false;
                    return <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data < 0 ? true : false;
                    return <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    const isValid = data > 0 ? true : false;
                    return <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data > 0 && <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data < 0 && <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data === 0 && <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        },
        {
            code: `
                type ChildProps = {
                    data: string;
                }

                type ComponentProps = {
                    data: ChildProps['data'];
                }

                const Component = ({ data }: ComponentProps) => {
                    return data == 0 && <Child />;
                }
            `,
            errors: [{ messageId: 'notValidUse' }]
        }
    ]
});
