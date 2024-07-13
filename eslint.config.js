const globals = require("globals");
const pluginJs = require("@eslint/js");
const jestPlugin = require("eslint-plugin-jest");

module.exports =  [
    {
        languageOptions:
     { 
         globals: {
             ...globals.node,
             ...globals.jest
         }, 
         ecmaVersion: 2022, 
         sourceType: "module" // Add jest globals
     }
    },
    pluginJs.configs.recommended, 
    jestPlugin.configs["flat/recommended"], // Add jest recommended config
    {
        rules: {
            ...jestPlugin.configs["flat/recommended"].rules, // Include Jest rules
            "strict": ["error", "global"],
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "always"],
            "no-unused-vars": "warn",
            "no-console": "warn",
            "camelcase": "error",
            "max-len": ["error", { "code": 100 }],
            "no-multiple-empty-lines": ["error", { "max": 1 }],
            "eqeqeq": "error",
            "curly": "error",
            "brace-style": ["error", "1tbs"],
            "prefer-const": "error",
            "arrow-body-style": ["error", "as-needed"],
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-template": "error",
            "no-param-reassign": "error",
            "prefer-destructuring": ["error", { "object": true, "array": false }],
            "no-duplicate-imports": "error",
            "spaced-comment": ["error", "always"],
            // You can add or modify Jest-specific rules here
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error"
            
        }
    }
];