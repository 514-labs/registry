/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx|js)$",
  collectCoverageFrom: ["src/**/*.(ts|tsx)"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
  testPathIgnorePatterns: ["/tests/integration/"],
};

module.exports = config;


