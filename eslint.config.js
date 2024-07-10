import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {
        languageOptions:
     { 
         globals: globals.node, 
         ecmaVersion: 2022, 
         sourceType: "module" 
     }
    },
    pluginJs.configs.recommended, 
    {
        rules: {
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
        }
    }
];