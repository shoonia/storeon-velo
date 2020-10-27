require('./mock.js');
const { createStoreon } = require('../lib/cjs.js');

describe('@ready event', () => {
  it('should be running with an empty state object', (done) => {
    createStoreon([
      (store) => {
        store.on('@ready', (state) => {
          expect(state).toEqual({});
          done();
        });
      },
    ]);
  });

  it('should be running with initial state', (done) => {
    createStoreon([
      (store) => {
        store.on('@init', () => ({ p: 1 }));
        store.on('@ready', (state) => {
          expect(state).toEqual({ p: 1 });
          done();
        });
      },
    ]);
  });

  it('should get the initial state from @ready event.', (done) => {
    const { connect } = createStoreon([
      (store) => {
        store.on('@ready', () => {
          return { key1: 3, key2: 7 };
        });
      },
    ]);

    connect((state) => {
      expect(state).toEqual({ key1: 3, key2: 7 });
      done();
    });
  });

  it('@ready should not affect to connect()', (done) => {
    const listener = jest.fn();

    const { connect } = createStoreon([
      (store) => {
        store.on('@init', () => ({ val: 0 }));
        store.on('@ready', () => {
          listener();
          return { val: 1 };
        });
      },
    ]);

    connect((state) => {
      expect(state).toEqual({ val: 1 });
      expect(listener).toHaveBeenCalled();
      done();
    });
  });
});
