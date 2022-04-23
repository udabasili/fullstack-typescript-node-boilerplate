module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": ["./tsconfig.json"]
    },
    "plugins": [
        "@typescript-eslint",
        "prettier"
    ],
    "env": {
        "node": true,
        "es6": true,
        "jest": true
    },
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": [
            2,
            {
                "allowString": false,
                "allowNumber": false
            }
        ]
    },
    "prettier": {
        "singleQuote": true
    },
    "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"]
}