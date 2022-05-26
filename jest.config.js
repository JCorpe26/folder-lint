/** @format */

module.exports = {
    roots: ['<rootDir>/src'],
    preset: 'ts-jest',
    testRegex: '(.*.test).ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    setupFiles: ['./src/test.setup.ts']
};
