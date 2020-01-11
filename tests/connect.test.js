require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('Connect to properties', () => {
  it('should be run only if change "x" property', (done) => {
    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1, y: 1 }));
        store.on('incX', ({ x }) => ({ x: x + 1 }));
        store.on('incY', ({ y }) => ({ y: y + 1 }));
      },
    ]);

    connect('x', (state) => {
      expect(state).toEqual({ x: 2, y: 2 });
      done();
    });

    dispatch('incY');
    dispatch('incX');
  });

  it('should be run twice time', () => {
    const callback = jest.fn();

    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1 }));
        store.on('run', ({ x }) => ({ x: x + 1 }));
      },
    ]);

    connect('x', callback);
    dispatch('run');
    dispatch('run');

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should be disconnected after first call', () => {
    const callback = jest.fn();
    const listener = jest.fn();

    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1}));
        store.on('run', ({ x }) => {
          listener();
          return { x: x + 1 };
        });
      },
    ]);

    const disconnect = connect('x', callback);

    dispatch('run');
    disconnect();
    dispatch('run');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should be connected twice', () => {
    const callback = jest.fn();

    const { connect, dispatch } = createStore([
      (store) => {
        store.on('@init', () => ({ z: 0 }));
        store.on('go', ({ z }) => ({ z: z + 1 }));
      },
    ]);

    connect('z', callback);
    connect('z', callback);
    dispatch('go');

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
