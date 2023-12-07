module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true,
        'jest': true,
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    },
    "globals": {
        "generateRelatedWords": true,
        "scoreContent": true,
        "rankContents": true,
        "getTopContent": true,
        "getEmbeddings": true,
        "combinedScore": true
    },
    'ignorePatterns': ["**/node_modules/**"]
}