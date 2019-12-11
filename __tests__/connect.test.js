require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('Connect to properties', () => {
  it('should be run only if change "x" property', (done) => {
    const { dispatch, connect, connectPage } = createStore([
      (store) => {
        store.on('@init', () => ({ x: 1, y: 1 }));
        store.on('incX', ({ x }) => ({ x: x + 1 }));
        store.on('incY', ({ y }) => ({ y: y + 1 }));
      },
    ]);

    connectPage(() => {
      connect('x', ({ x, y }) => {
        expect(x).toBe(2);
        expect(y).toBe(2);
        done();
      });

      dispatch('incY');
      dispatch('incX');
    });
  });
});
