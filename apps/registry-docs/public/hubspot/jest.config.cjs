/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$",
  collectCoverageFrom: ["src/**/*.(ts|tsx)"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  testPathIgnorePatterns: ["/tests/integration/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

module.exports = config;


