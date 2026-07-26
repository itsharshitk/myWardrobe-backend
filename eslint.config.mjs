import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.js'],

        plugins: {
            js
        },

        extends: ['js/recommended'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',

            globals: {
                ...globals.node
            }
        },

        rules: {
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_'
                }
            ],

            eqeqeq: [
                'error',
                'always'
            ],

            curly: [
                'error',
                'all'
            ],

            'no-console': 'off'
        }
    },

    eslintConfigPrettier
]);