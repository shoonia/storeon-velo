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

  it('should be called twice time', () => {
    const listener = jest.fn();

    const { dispatch } = createStore([
      (store) => {
        store.on('run', listener);
      },
    ]);

    dispatch('run');
    dispatch('run');
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should be passed data', (done) => {
    const { dispatch } = createStore([
      (store) => {
        store.on('run', (_, data) => {
          expect(data).toBe(5);
          done();
        });
      },
    ]);

    dispatch('run', 5);
  });
});
