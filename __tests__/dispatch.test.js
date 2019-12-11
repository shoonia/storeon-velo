require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('dispatch events', () => {
  it('should increment value', () => {
    const { dispatch, getState } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1 }));
        store.on('inc', ({ x }) => ({ x: x + 1 }));
      },
    ]);

    expect(getState().x).toBe(1);
    dispatch('inc');
    expect(getState().x).toBe(2);
  });
});
