import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("next/core-web-vitals", "@rocketseat/eslint-config/next"),
    {
        rules: {
            "prefer-arrow-callback": "error",

            "no-console": ["warn", {
                allow: ["warn", "error"],
            }],

            "sort-imports": ["error", {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
            }],

            "import/order": ["error", {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",

                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            }],
        },
    },
];