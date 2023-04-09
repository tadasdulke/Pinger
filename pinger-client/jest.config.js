module.exports = {
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        "^@Api(.*)$": "<rootDir>/src/api$1",
        "^@Config(.*)$": "<rootDir>/src/config$1",
        "^@Common(.*)$": "<rootDir>/src/common$1",
        "^@Store(.*)$": "<rootDir>/src/store$1",
        "^@Components(.*)$": "<rootDir>/src/components$1",
        "^@Router(.*)$": "<rootDir>/src/router$1",
        "^@Utils(.*)$": "<rootDir>/src/utils$1",
        "^@Services(.*)$": "<rootDir>/src/services$1",
        "^@Hooks(.*)$": "<rootDir>/src/hooks$1",
    } 
};