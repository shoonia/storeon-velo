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

  it('should be run twice time', (done) => {
    const callback = jest.fn();

    const { dispatch, connect, connectPage } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1 }));
        store.on('run', ({ x }) => ({ x: x + 1 }));
      },
    ]);

    connect('x', callback);

    connectPage(() => {
      dispatch('run');
      dispatch('run');

      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should be disconnected after first call', (done) => {
    const callback = jest.fn();
    const listener = jest.fn();

    const { dispatch, connect, connectPage } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1}));
        store.on('run', ({ x }) => {
          listener();
          return { x: x + 1 };
        });
      },
    ]);

    const disconnect = connect('x', callback);

    connectPage(() => {
      dispatch('run');
      disconnect();
      dispatch('run');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should be connected twice', (done) => {
    const callback = jest.fn();

    const { dispatch, connect, connectPage } = createStore([
      (store) => {
        store.on('@init', () => ({ z: 0 }));
        store.on('go', ({ z }) => ({ z: z + 1 }));
      },
    ]);

    connect('z', callback);
    connect('z', callback);

    connectPage(() => {
      dispatch('go');
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should get the actual current data', (done) => {
    const listener = jest.fn();

    const { connect } = createStore([
      (store) => {
        store.on('@init', () => {
          listener();
          return { v: 5 };
        });

        store.on('@ready', ({ v }) => {
          listener();
          expect(v).toBe(5);
          return { v: 10 };
        });
      },
    ]);

    connect('v', ({ v }) => {
      expect(v).toBe(10);
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should not be affected connect() until @ready event', (done) => {
    const listener = jest.fn();

    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ j: 0 }));
        store.on('update', ({ j }) => {
          listener();
          return { j: j + 1 };
        });
      },
    ]);

    connect('j', ({ j }) => {
      expect(j).toBe(2);
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });

    dispatch('update');
    dispatch('update');
  });

  it('should not be affected connect() in @ready -> store.dispatch()', (done) => {
    const listener = jest.fn();

    const { dispatch, connect } = createStore([
      (store) => {
        store.on('@init', () => ({ c: 0 }));
        store.on('@ready', () => {
          store.dispatch('inc');
        });
        store.on('inc', ({ c }) => {
          listener();
          return { c: c + 1 };
        });
      },
    ]);

    dispatch('inc');

    connect('c', (state) => {
      expect(state).toEqual({ c:  2 });
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
