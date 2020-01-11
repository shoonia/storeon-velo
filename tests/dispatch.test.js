require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('dispatch events', () => {
  it('should be incremented value', () => {
    const { dispatch, getState } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1 }));
        store.on('inc', ({ x }) => ({ x: x + 1 }));
      },
    ]);

    expect(getState()).toEqual({ x: 1 });
    dispatch('inc');
    expect(getState()).toEqual({ x: 2 });
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

  it('should be passed data', () => {
    const listener = jest.fn();

    const { dispatch } = createStore([
      (store) => {
        store.on('@init', () => ({}));
        store.on('run', listener);
      },
    ]);

    dispatch('run', { data: 1 });

    expect(listener).toHaveBeenCalledWith({}, { data: 1 });
  });
});
