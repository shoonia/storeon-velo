require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('@ready event', () => {
  it('@ready should be running', (done) => {
    createStore([
      (store) => {
        store.on('@init', () => ({ k: 1 }));
        store.on('@ready', (state) => {
          expect(state).toEqual({ k: 1 });
          done();
        });
      },
    ]);
  });

  it('@ready should be working with async callback', (done) => {
    createStore([
      (store) => {
        store.on('@init', () => ({ p: 10 }));
        store.on('@ready', async (state) => {
          await expect(state).toEqual({ p: 10 });
          done();
        });
      },
    ]);
  });
});
