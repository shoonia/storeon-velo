require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('@ready event', () => {
  it('should be running with an empty state object', (done) => {
    createStore([
      (store) => {
        store.on('@ready', (state) => {
          expect(state).toEqual({});
          done();
        });
      },
    ]);
  });

  it('should be running with initial state', (done) => {
    createStore([
      (store) => {
        store.on('@init', () => ({ p: 1 }));
        store.on('@ready', (state) => {
          expect(state).toEqual({ p: 1 });
          done();
        });
      },
    ]);
  });
});
