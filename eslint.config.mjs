import ljharb from '@ljharb/eslint-config/flat';
import ljharbTests from '@ljharb/eslint-config/flat/tests';

const testFiles = [
    'test/**',
    'test-*',
    'example/**',
];

export default [
    ...ljharb,
    {
        rules: {
            complexity: 'off',
            'func-style': ['error', 'declaration'],
            indent: ['error', 4],
            'max-lines': 'warn',
            'max-lines-per-function': 'warn',
            'max-params': ['error', 4],
            'max-statements': 'off',
            'max-statements-per-line': ['error', { max: 2 }],
            'no-magic-numbers': 'off',
            'no-param-reassign': 'warn',
            strict: 'off', // TODO
        },
    },
    ...ljharbTests.map((c) => ({
        ...c,
        files: testFiles,
    })),
    {
        files: testFiles,
        rules: {
            'id-length': 'off',
        },
    },
    {
        files: ['example/**'],
        rules: {
            'no-console': 'off',
        },
    },
    {
        files: ['test/browser/**'],
        languageOptions: {
            globals: {
                document: 'readonly',
            },
        },
    },
    {
        files: ['test/bigint*'],
        rules: {
            'new-cap': [
                'error', {
                    capIsNewExceptions: ['BigInt'],
                },
            ],
        },
    },
    {
        files: ['index.js'],
        languageOptions: {
            globals: {
                HTMLElement: 'readonly',
            },
        },
        rules: {
            'no-use-before-define': 'warn',
        },
    },
];
