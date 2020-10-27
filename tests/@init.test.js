require('./mock.js');
const { createStore, createStoreon } = require('../lib/cjs.js');

describe('@init event', () => {
  const create = (initialData) => createStoreon([
    (store) => {
      store.on('@init', () => initialData);
    },
  ]);

  it('should be the same function', () => {
    expect(createStore).toEqual(createStoreon);
  });

  it('getState() initial run', () => {
    const { getState } = create({ xyz: 15 });

    expect(getState()).toEqual({ xyz: 15 });
  });

  it('connect() initial run', (done) => {
    const { connect } = create({ x: 5 });

    connect('x', (state) => {
      expect(state).toEqual({ x: 5 });
      done();
    });
  });

  it('connect() should be working with async callback', (done) => {
    const { connect } = create({ x: 5 });

    connect('x', async (state) => {
      await expect(state).toEqual({ x: 5 });
      done();
    });
  });

  it('connectPage() initial run', (done) => {
    const { connectPage } = create({ a: 'hello' });

    connectPage((state) => {
      expect(state).toEqual({ a: 'hello' });
      done();
    });
  });

  it('connectPage() should be working with async callback', (done) => {
    const { connectPage } = create({ x: 5 });

    connectPage(async (state) => {
      await expect(state).toEqual({ x: 5 });
      done();
    });
  });

  it('should execute in the strict queue @init -> @ready -> connectPage() -> connect()', (done) => {
    const listener = jest.fn();
    let increment = 0;

    const { connect, connectPage } = createStoreon([
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
