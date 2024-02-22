import { createStoreon } from '..';

describe('getState method', () => {
  it('should update state', () => {
    expect.hasAssertions();

    const { setState, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
      },
    ]);

    setState({ x: 1 });

    expect(getState()).toStrictEqual({ x: 1, y: 0 });
  });

  it('should add new property to state', () => {
    expect.hasAssertions();

    const { setState, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 10 }));
      },
    ]);

    setState({ b: 20 });

    expect(getState()).toStrictEqual({ a: 10, b: 20 });
  });

  it('should fire on @set event', (done) => {
    expect.hasAssertions();

    const { setState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 1, b: 0 }));
        store.on('@set', (state, changes) => {
          expect(state).toStrictEqual({ a: 1, b: 1 });
          expect(changes).toStrictEqual({ b: 1 });
          done();
        });
      },
    ]);

    setState({ b: 1 });
  });
});
