/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  rootDir: '.',
  setupFiles: [
    '<rootDir>/tests/mock.js',
  ],
};

export { config as default };
