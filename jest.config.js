/** @format */

module.exports = {
    rootDir: 'src',
    preset: 'ts-jest',
    testRegex: '(.*.test).ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    setupFiles: ['./test.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    }
};
