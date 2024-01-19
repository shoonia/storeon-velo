import { randomUUID } from 'node:crypto';
import { jest } from '@jest/globals';
import { createStoreon } from '..';

describe('Multi keys', () => {
  it('should call the cb two times', () => {
    expect.hasAssertions();

    const eventOne = randomUUID();
    const eventTwo = randomUUID();

    /** @type {*} */
    const cb = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(eventOne, (_, x) => ({ x }));
        store.on(eventTwo, (_, y) => ({ y }));
      },
    ]);

    readyStore();

    connect('x', 'y', cb);
    dispatch(eventOne, 1);
    dispatch(eventTwo, 1);

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('should run one time of change two properties synchronic', () => {
    expect.hasAssertions();

    const event = randomUUID();

    /** @type {*} */
    const cb = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(event, () => ({ x: '1', y: '1' }));
      },
    ]);

    readyStore();
    connect('x', 'y', cb);
    dispatch(event);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({ x: '1', y: '1' });
  });

  it('should be disconnected', () => {
    expect.hasAssertions();

    const eventOne = randomUUID();
    const eventTwo = randomUUID();

    /** @type {*} */
    const cb = jest.fn();
    const spy = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(eventOne, (_, x) => {
          spy();
          return { x };
        });

        store.on(eventTwo, (_, y) => {
          spy();
          return { y };
        });
      },
    ]);

    readyStore();

    const off = connect('x', 'y', cb);

    dispatch(eventOne, '1');
    dispatch(eventTwo, '1');

    expect(cb).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(2);

    off();

    dispatch(eventOne, '2');
    dispatch(eventTwo, '2');

    expect(cb).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledTimes(4);
  });
});
