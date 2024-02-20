import { randomUUID } from 'node:crypto';
import { jest } from '@jest/globals';
import { createStoreon } from '..';

describe('connect method', () => {
  it('should run method connect without key', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([]);

    connect(/* no key */(state) => {
      expect(state).toStrictEqual({});
      done();
    });

    readyStore();
  });

  it('should run with async function', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([]);

    // eslint-disable-next-line require-await
    connect(async (state) => {
      expect(state).toStrictEqual({});
      done();
    });

    readyStore();
  });

  it('should run method connect with an unknown key', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([]);

    connect(randomUUID(), (state) => {
      expect(state).toStrictEqual({});
      done();
    });

    readyStore();
  });

  it('should run only after @ready', (done) => {
    expect.hasAssertions();

    const eventX = randomUUID();
    const eventY = randomUUID();

    const spy = jest.fn();

    const { connect, dispatch, readyStore } = createStoreon([
      (store) => {
        store.on(eventX, (_, x) => ({ x }));
        store.on(eventY, (_, y) => ({ y }));
        store.on('@ready', spy);
      },
    ]);

    connect('x', (state) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ x: 2, y: 4 }, undefined);
      expect(state).toStrictEqual({ x: 2, y: 4 });
      done();
    });

    dispatch(eventX, 2);
    dispatch(eventY, 4);

    readyStore();
  });

  it('should disconnect after the first call', (done) => {
    expect.hasAssertions();

    const event = randomUUID();

    /** @type {*} */
    const cb = jest.fn();
    const spy = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ data: '' }));
        store.on(event, (_, data) => {
          spy();
          return { data };
        });
      },
    ]);

    readyStore();

    const off = connect('data', cb);

    dispatch(event, 'one');
    off();
    dispatch(event, 'two');

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith({ data: 'one' });
    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });

  it('should connect twice', () => {
    expect.hasAssertions();

    const event = randomUUID();

    /** @type {*} */
    const cb = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(event, () => ({ z: 1 }));
      },
    ]);

    readyStore();

    connect('z', cb);
    connect('z', cb);

    expect(cb).toHaveBeenCalledTimes(0);
    dispatch(event);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith({ z: 1 });
  });

  it('should get the actual data', (done) => {
    expect.hasAssertions();

    const spy = jest.fn();

    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => {
          spy();
          return { i: 0 };
        });

        store.on('@ready', (state) => {
          spy();
          expect(state).toStrictEqual({ i: 0 });
          return { i: 1 };
        });
      },
    ]);

    connect('i', (state) => {
      expect(state).toStrictEqual({ i: 1 });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });

    readyStore();
  });

  it('should not be affected connect if use dispatch in @ready', (done) => {
    expect.hasAssertions();

    const event = randomUUID();

    const spy = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ t: 0 }));

        store.on('@ready', () => {
          store.dispatch(event);
        });

        store.on(event, ({ t }) => {
          spy();
          return { t: t + 1 };
        });
      },
    ]);

    dispatch(event);

    connect('t', (state) => {
      expect(state).toStrictEqual({ t: 2 });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });

    readyStore();
  });

  it('should not run with @ready event if set up inside connectPage method', (done) => {
    expect.hasAssertions();

    const event = randomUUID();

    /** @type {*} */
    const cbOutside = jest.fn();
    /** @type {*} */
    const cbInside = jest.fn();

    const { dispatch, connect, readyStore } = createStoreon([
      (store) => {
        store.on(event, () => ({ a: 'text' }));
      },
    ]);

    connect('a', cbOutside);

    connect(() => {
      connect('a', cbInside);

      setTimeout(() => {
        dispatch(event);

        expect(cbOutside).toHaveBeenCalledTimes(2);
        expect(cbInside).toHaveBeenCalledTimes(1);
        expect(cbInside).toHaveBeenCalledWith({ a: 'text' });
        done();
      }, 5);
    });

    readyStore();
  });
});
