import { createStoreon } from '..';

describe('getState method', () => {
  it('should partial update state', () => {
    const { setState, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
      },
    ]);

    setState({ x: 1 });

    expect(getState()).toEqual({ x: 1, y: 0 });
  });

  it('should add new property to state', () => {
    const { setState, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 10 }));
      },
    ]);

    setState({ b: 20 });

    expect(getState()).toEqual({ a: 10, b: 20 });
  });
});
