import { randomUUID } from 'node:crypto';
import { describe, it, mock } from 'node:test';

import { expect } from './expect.js';
import { createStoreon } from '../src/index.js';

describe('Multi keys', () => {
  it('should call the cb two times', () => {
    const eventOne = randomUUID();
    const eventTwo = randomUUID();
    const cb = mock.fn();

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
    expect(cb).toHaveBeenNthCalledWith(1, { x: 1 });
    expect(cb).toHaveBeenNthCalledWith(2, { x: 1, y: 1 });
  });

  it('should run one time of change two properties synchronic', () => {
    const event = randomUUID();
    const cb = mock.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(event, () => ({ x: '1', y: '1' }));
      },
    ]);

    readyStore();
    connect('x', 'y', cb);
    dispatch(event);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenLastCalledWith({ x: '1', y: '1' });
  });

  it('should be disconnected', () => {
    const eventOne = randomUUID();
    const eventTwo = randomUUID();
    const cb = mock.fn();
    const spy = mock.fn();

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
