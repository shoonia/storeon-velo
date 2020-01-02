require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('Multi keys', () => {
  it('should be called twice time', () => {
    const callback = jest.fn();

    const { dispatch, connect, getState } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
        store.on('x', ({ x }) => ({ x: x + 1 }));
        store.on('y', ({ y }) => ({ y: y + 1 }));
      },
    ]);

    connect('x', 'y', callback);
    dispatch('x');
    dispatch('y');

    expect(callback).toHaveBeenCalledTimes(2);
    expect(getState()).toEqual({ x: 1, y: 1 });
  });

  it('should be disconnected', () => {
    const callback = jest.fn();
    const listener = jest.fn();

    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
        store.on('x', ({ x }) => {
          listener();
          return { x: x + 1 };
        });
        store.on('y', ({ y }) => {
          listener();
          return { y: y + 1 };
        });
      },
    ]);

    var disconnect = connect('x', 'y', callback);
    dispatch('x');
    dispatch('y');
    disconnect();
    dispatch('x');
    dispatch('y');

    expect(callback).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledTimes(4);
  });
});
