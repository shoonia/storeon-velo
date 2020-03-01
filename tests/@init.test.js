require('./mock.js');
const { createStore } = require('../dist/index.js');

describe('@init event', () => {
  const init = () => createStore([
    (store) => {
      store.on('@init', () => ({ x: 5 }));
    },
  ]);

  it('getState() initial run', () => {
    const { getState } = init();

    expect(getState().x).toBe(5);
  });

  it('connect() initial run', (done) => {
    const { connect } = init();

    connect('x', ({ x }) => {
      expect(x).toBe(5);
      done();
    });
  });

  it('connect() should be working with async callback', (done) => {
    const { connect } = init();

    connect('x', async (state) => {
      await expect(state).toEqual({ x: 5 });
      done();
    });
  });

  it('connectPage() initial run', (done) => {
    const { connectPage } = init();

    connectPage(({ x }) => {
      expect(x).toBe(5);
      done();
    });
  });

  it('connectPage() should be working with async callback', (done) => {
    const { connectPage } = init();

    connectPage(async (state) => {
      await expect(state).toEqual({ x: 5 });
      done();
    });
  });

  it('should execute in the strict queue @init -> @ready -> connectPage() -> connect()', (done) => {
    const listener = jest.fn();
    let increment = 0;

    const { connect, connectPage } = createStore([
      (store) => {
        store.on('@init', () => {
          listener();
          expect(increment).toBe(0);
          increment++;
          return { prop: '' };
        });

        store.on('@ready', () => {
          listener();
          expect(increment).toBe(1);
          increment++;
        });
      },
    ]);

    connect('prop', () => {
      expect(increment).toBe(3);
      expect(listener).toHaveBeenCalledTimes(3);
      done();
    });

    connectPage(() => {
      listener();
      expect(increment).toBe(2);
      increment++;
    });
  });
});
