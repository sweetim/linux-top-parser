// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    define: {
        "import.meta.vitest": "undefined",
    },
    test: {
        includeSource: [
            "src/**/*.{ts}"
        ],
        exclude: [
            "lib/**",
            "node_modules/**"
        ],
        globalSetup: [
            "./test/global-setup.ts"
        ],
        outputFile: "./coverage/test-results.xml",
        coverage: {
            reporter: [
                "text",
                "lcov"
            ]
        },
    },
})
