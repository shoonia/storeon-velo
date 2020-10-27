require('./mock.js');
const { createStoreon } = require('..');

describe('dispatch events', () => {
  it('should be called twice time', () => {
    const listener = jest.fn();

    const { dispatch } = createStoreon([
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

    const { dispatch } = createStoreon([
      (store) => {
        store.on('run', (_, data) => listener(data));
      },
    ]);

    dispatch('run', { a: 1 });
    expect(listener).toHaveBeenCalledWith({ a: 1 });
  });

  it('should be incremented value', () => {
    const { dispatch, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 1 }));
        store.on('inc', ({ x }) => ({ x: x + 1 }));
      },
    ]);

    expect(getState()).toEqual({ x: 1 });
    dispatch('inc');
    expect(getState()).toEqual({ x: 2 });
  });
});
