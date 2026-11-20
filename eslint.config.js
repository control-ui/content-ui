import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import eslintReact from "@eslint-react/eslint-plugin";

export default [
    {
        ignores: [
            "**/dist/**",
            "**/coverage/**",
            "**/build/**",
            "**/node_modules/**",
            "tmp/**",
            "apps/sandbox/**",
        ],
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
    },
    js.configs.recommended,
    ...tsPlugin.configs["flat/recommended"],
    reactHooks.configs.flat.recommended,
    eslintReact.configs["recommended-typescript"],
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
                process: "readonly",
            },
        },
        rules: {
            "no-console": "off",
        },
    },
    {
        files: ["**/*.{ts,tsx,d.ts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
                process: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            "no-console": "off",
            "@typescript-eslint/no-deprecated": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    caughtErrors: "none",
                },
            ],
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
            "@typescript-eslint/no-empty-interface": "error",
            indent: [
                "error",
                4,
                {
                    SwitchCase: 1,
                },
            ],
            "no-trailing-spaces": "warn",
            "comma-dangle": [
                "error",
                {
                    arrays: "always-multiline",
                    objects: "always-multiline",
                    imports: "always-multiline",
                    exports: "always-multiline",
                    functions: "always-multiline",
                },
            ],
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "semi-style": "off",
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        "@mui/material",
                        "@mui/icon-material",
                    ],
                    patterns: [
                        "@mui/*/*/*",
                    ],
                },
            ],
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/static-components": "off",
            "react-hooks/refs": "off",
            "@eslint-react/static-components": "off",
            "@eslint-react/no-use-context": "off",
            "@eslint-react/no-context-provider": "off",
            "@eslint-react/no-forward-ref": "off",
            "@eslint-react/naming-convention-ref-name": "off",
            "@eslint-react/naming-convention-context-name": "off",
            "@eslint-react/naming-convention-id-name": "off",
            "@eslint-react/no-array-index-key": "off",
            "@eslint-react/web-api-no-leaked-event-listener": "off",
            "@eslint-react/set-state-in-effect": "off",
            "@eslint-react/use-state": "off",
        },
    },
    {
        files: ["server/feed/**/*.{ts,tsx,d.ts}"],
        languageOptions: {
            globals: {
                ...globals.node,
                process: "readonly",
            },
        },
        rules: {
            "@typescript-eslint/no-namespace": "off",
        },
    },
];
