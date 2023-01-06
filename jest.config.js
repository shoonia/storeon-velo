/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: '.',
  setupFiles: [
    '<rootDir>/tests/legacy/mock.js',
  ],
};

export { config as default };
