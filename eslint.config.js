import configPrettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import regexp from 'eslint-plugin-regexp';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const SRC_GLOB = '**/*.{js,cjs,mjs}';
const WARN = 'warn';
const ERROR = 'error';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			'**/.reports/**/*',
			'**/node_modules/**/*',
			'src/assets/**/*',
		],
	},
	{
		files: [SRC_GLOB],
		languageOptions: {
			ecmaVersion: 2025,
			globals: { ...globals.node, ...globals.browser },
			sourceType: 'module',
		},
		plugins: { perfectionist, promise, regexp, sonarjs, unicorn },
		rules: {
			complexity: [WARN, 40],
			eqeqeq: WARN,
			'no-console': [WARN, { allow: ['info', 'warn', 'error'] }],
			'no-var': ERROR,
			'prefer-const': WARN,
			'prefer-template': WARN,
			'promise/catch-or-return': ERROR,
			'sonarjs/no-identical-functions': ERROR,
			'unicorn/prefer-node-protocol': ERROR,
			'unicorn/filename-case': [WARN, { cases: { kebabCase: true } }],
			'perfectionist/sort-named-imports': WARN,
			'regexp/no-dupe-disjunctions': ERROR,
		},
	},
	configPrettier,
	{
		files: [SRC_GLOB],
		...prettier,
		rules: { 'prettier/prettier': WARN },
	},
];
