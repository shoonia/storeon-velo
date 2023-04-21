import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { createStoreon } from '../../legacy';

describe('@set event', () => {
  it('should update state', (done) => {
    expect.hasAssertions();

    const { getState, connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => ({ a: 0, b: 0 }));

        store.on('@ready', () => {
          store.set({ a: 5 });
        });
      },
    ]);

    connectPage((state) => {
      expect(state).toEqual({ a: 5, b: 0 });
      expect(getState()).toEqual({ a: 5, b: 0 });
      done();
    });
  });

  it('should work with async handler', (done) => {
    expect.hasAssertions();

    const event = randomUUID();

    const { connect, connectPage, dispatch, getState } = createStoreon([
      (store) => {
        store.on('@init', () => ({ i: 10, p: null }));

        store.on(event, async () => {
          await setTimeout(5);
          store.set({ i: 5 });
        });
      },
    ]);

    connectPage(() => {
      connect('i', (state) => {
        expect(state).toEqual({ i: 5, p: null });
        expect(getState()).toEqual({ i: 5, p: null });
        done();
      });

      dispatch(event);
    });
  });

  it('should update the state with @set event', (done) => {
    expect.hasAssertions();

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
