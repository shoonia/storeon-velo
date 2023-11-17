/** @type {import('jest').Config} */
const config = {
  rootDir: '.',
  setupFiles: [
    '<rootDir>/tests/legacy/mock.js',
  ],
};

export { config as default };
