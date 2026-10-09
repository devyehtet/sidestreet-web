import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
export default [
 {ignores:['.next/**','node_modules/**']},
 {files:['**/*.{js,jsx,mjs}'],languageOptions:{ecmaVersion:'latest',sourceType:'module',parserOptions:{ecmaFeatures:{jsx:true}},globals:{...globals.browser,...globals.node}},plugins:{'react-hooks':reactHooks},rules:{...js.configs.recommended.rules,'no-unused-vars':['error',{varsIgnorePattern:'^[A-Z]',argsIgnorePattern:'^_'}],'react-hooks/rules-of-hooks':'error','react-hooks/exhaustive-deps':'warn'}},
];
