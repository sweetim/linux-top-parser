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
        coverage: {
            reporter: [
                "text",
                "lcov"
            ]
        }
    },
})
