require('./mock.js');
const { createStoreon } = require('..');

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

  it('should get the initial state from @ready event in connect()', (done) => {
    const { connect } = createStoreon([
      (store) => {
        store.on('@ready', () => {
          return { val: 1 };
        });
      },
    ]);

    connect('val', (state) => {
      expect(state).toEqual({ val: 1 });
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

    connect('val', (state) => {
      expect(state).toEqual({ val: 1 });
      expect(listener).toHaveBeenCalled();
      done();
    });
  });
});
