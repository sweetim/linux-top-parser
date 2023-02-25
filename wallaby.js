module.exports = () => ({
    autoDetect: true,
    files: [
        "src/**/*.ts",
        "!src/**/*.test.ts"
    ],
    tests: [
        "src/**/*.test.ts",
        "test/**/*.test.ts"
    ]
})