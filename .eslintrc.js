const isDebug = process.env.NODE_ENV === 'development' ? 1 : 2

module.exports = {
    "env": {
        "node": true,
        "mocha": true,
        "jest": true,
        "es2021": true,
        "browser": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jsx-a11y",
        "react-hooks"
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "globals": {
        "JSX": true,
        "React": true,
        "NodeJS": true,
        "Promise": true
    },
    "rules": {
        "@typescript-eslint/no-empty-function": 0,
        "no-console": [isDebug, { "allow": ["error"] }],
        "consistent-return": 2,
        "curly": [2, "multi-or-nest"],
        "dot-location": 0,
        "eqeqeq": 2,
        "no-alert": 2,
        "no-eq-null": 2,
        "no-lone-blocks": 2,
        "no-return-await": 2,
        "no-unused-expressions": 2,
        "no-label-var": isDebug,
        "array-bracket-spacing": 2,
        "brace-style": 0,
        "comma-spacing": isDebug,
        "consistent-this": isDebug,
        "eol-last": 0,
        "multiline-ternary": [2, "always-multiline"],
        "new-cap": [2, { "capIsNew": false }],
        "no-trailing-spaces": 0,
        "semi": ["error", "never"],
        "space-before-blocks": 2,
        "space-in-parens": 2,
        "spaced-comment": 2,
        "switch-colon-spacing": ["error", { "after": true, "before": false }],
        "arrow-spacing": 2,
        "quotes": [0, "single"],
        "key-spacing": 2,
        "comma-dangle": ["error", "never"],
        "react-hooks/exhaustive-deps": 0,
        "no-empty-function": isDebug,
        "react/forbid-prop-types": 0,
        "react/prop-types": 0,
        "react/display-name": 0,
        "prefer-promise-reject-errors": 0,
        "react/no-array-index-key": 2,
        "react/no-unused-state": 2,
        "react/jsx-indent-props": isDebug,
        "react/jsx-no-comment-textnodes": isDebug,
        "react/jsx-no-duplicate-props": 2,
        "react/jsx-no-target-blank": [isDebug, { "enforceDynamicLinks": "always" }],
        "react/jsx-no-undef": 2,
        "react/jsx-props-no-multi-spaces": isDebug,
        "react/jsx-tag-spacing": isDebug,
        "react/jsx-uses-vars": 2,
        "react/jsx-wrap-multilines": 2,
        "react-hooks/rules-of-hooks": 2,
        "no-unused-vars": isDebug
    }
}
