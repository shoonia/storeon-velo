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

  it('should get the initial state from @ready event in connectPage()', (done) => {
    const { connectPage } = createStoreon([
      (store) => {
        store.on('@ready', () => {
          return { val: 1 };
        });
      },
    ]);

    connectPage((state) => {
      expect(state).toEqual({ val: 1 });
      done();
    });
  });

  it('connect() should run once after @ready with the new state', (done) => {
    const listener = jest.fn();

    const { connect } = createStoreon([
      (store) => {
        store.on('@init', () => {
          listener();
          return { key1: 1 };
        });
        store.on('@ready', () => {
          listener();
          return { key2: 2 };
        });
      },
    ]);

    connect('key1', 'key2', (state) => {
      expect(state).toEqual({ key1: 1, key2: 2 });
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('connectPage() should run once after @ready with the new state', (done) => {
    const listener = jest.fn();

    const { connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => {
          listener();
          return { key1: 1 };
        });
        store.on('@ready', () => {
          listener();
          return { key2: 2 };
        });
      },
    ]);

    connectPage((state) => {
      expect(state).toEqual({ key1: 1, key2: 2 });
      expect(listener).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
