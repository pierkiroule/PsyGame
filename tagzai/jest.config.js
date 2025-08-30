export default {
  // Environnement de test
  testEnvironment: 'node',
  
  // Extensions de fichiers à tester
  extensionsToTreatAsEsm: ['.js'],
  
  // Transformations
  transform: {},
  
  // Modules à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/logs/'
  ],
  
  // Collecte de couverture
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/logs/**',
    '!**/db/**',
    '!**/*.config.js'
  ],
  
  // Seuil de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Répertoires de test
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup et teardown
  setupFilesAfterEnv: [],
  
  // Timeout des tests
  testTimeout: 10000,
  
  // Verbosité
  verbose: true
};