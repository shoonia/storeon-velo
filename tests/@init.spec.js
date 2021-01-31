require('./mock.js');

const { createStoreon } = require('..');

describe('@init event', () => {
  it('should run @init event', () => {
    const { getState } = createStoreon([
      (store) => store.on('@init', () => ({ a: 0 })),
    ]);

    expect(getState()).toEqual({ a: 0 });
  });

  it('should run initial connect', (done) => {
    const { connect } = createStoreon([
      (store) => store.on('@init', () => ({ b: 1 })),
    ]);

    connect('b', (state) => {
      expect(state).toEqual({ b: 1 });
      done();
    });
  });

  it('should run initial connectPage', (done) => {
    const { connectPage } = createStoreon([
      (store) => store.on('@init', () => ({ c: 2 })),
    ]);

    connectPage((state) => {
      expect(state).toEqual({ c: 2 });
      done();
    });
  });

  it('should execute in the strict queue @init > @ready > connectPage > connect', (done) => {
    const spy = jest.fn();

    const { connect, connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => {
          spy();
          expect(spy).toHaveBeenCalledTimes(1);
          return { d: 3 };
        });

        store.on('@ready', () => {
          spy();
          expect(spy).toHaveBeenCalledTimes(2);
        });
      },
    ]);

    connect('d', () => {
      spy();
      expect(spy).toHaveBeenCalledTimes(4);
      done();
    });

    connectPage(() => {
      spy();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
