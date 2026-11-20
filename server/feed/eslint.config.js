import rootConfig from "../../eslint.config.js";
import globals from "globals";

export default [
    ...rootConfig,
    {
        files: ["**/*.{ts,tsx,d.ts}"],
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
