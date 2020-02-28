require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('@ready event', () => {
  it('ready event run', (done) => {
    createStore([
      (store) => {
        store.on('@init', () => ({ k: 1 }));
        store.on('@ready', (state) => {
          expect(state.k).toBe(1);
          done();
        });
      },
    ]);
  });
});
