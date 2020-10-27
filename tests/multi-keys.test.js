require('./mock.js');
const { createStoreon } = require('../lib/cjs.js');

describe('Multi keys', () => {
  it('should be called twice time', (done) => {
    const callback = jest.fn();

    const { dispatch, connect, connectPage, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
        store.on('_x', ({ x }) => ({ x: x + 1 }));
        store.on('_y', ({ y }) => ({ y: y + 1 }));
      },
    ]);

    connect('x', 'y', callback);

    connectPage(() => {
      dispatch('_x');
      dispatch('_y');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(getState()).toEqual({ x: 1, y: 1 });
      done();
    });
  });

  it('should be disconnected', (done) => {
    const callback = jest.fn();
    const listener = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
        store.on('_x', ({ x }) => {
          listener();
          return { x: x + 1 };
        });
        store.on('_y', ({ y }) => {
          listener();
          return { y: y + 1 };
        });
      },
    ]);

    const disconnect = connect('x', 'y', callback);

    connectPage(() => {
      dispatch('_x');
      dispatch('_y');
      disconnect();
      dispatch('_x');
      dispatch('_y');

      expect(callback).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledTimes(4);
      done();
    });
  });
});
