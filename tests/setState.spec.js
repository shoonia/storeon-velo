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

  it('should run store subscription @set', (done) => {
    const { setState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 1, b: 0 }));
        store.on('@set', (state, changes) => {
          expect(state).toEqual({ a: 1, b: 1 });
          expect(changes).toEqual({ b: 1 });
          done();
        });
      },
    ]);

    setState({ b: 1 });
  });

  it('should update the state with @set event', (done) => {
    const { dispatch, connectPage, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ x: 0, y: 0 }));
      },
    ]);

    dispatch('@set', { x: 9 });

    connectPage((state) => {
      expect(state).toEqual({ x: 9, y: 0 });
      expect(getState()).toEqual({ x: 9, y: 0 });
      done();
    });
  });
});
