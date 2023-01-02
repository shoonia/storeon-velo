import { randomUUID } from 'node:crypto';
import { jest } from '@jest/globals';
import { createStoreon } from '../..';

describe('connect method', () => {
  it('should run method connect without key', (done) => {
    const { connect } = createStoreon([]);

    connect(/* no key */ (state) => {
      expect(state).toEqual({});
      done();
    });
  });

  it('should run with async function', (done) => {
    const { connect } = createStoreon([]);

    // eslint-disable-next-line require-await
    connect(async (state) => {
      expect(state).toEqual({});
      done();
    });
  });

  it('should run method connect with an unknown key', (done) => {
    const { connect } = createStoreon([]);

    connect('unknown', (state) => {
      expect(state).toEqual({});
      done();
    });
  });

  it('should run only after @ready', (done) => {
    const eventX = randomUUID();
    const eventY = randomUUID();

    const spy = jest.fn();

    const { connect, dispatch } = createStoreon([
      (store) => {
        store.on(eventX, (_, x) => ({ x }));
        store.on(eventY, (_, y) => ({ y }));

        store.on('@ready', (state) => {
          spy(state);
        });
      },
    ]);

    connect('x', (state) => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ x: 2, y: 4 });
      expect(state).toEqual({ x: 2, y: 4 });
      done();
    });

    dispatch(eventX, 2);
    dispatch(eventY, 4);
  });

  it('should disconnect after the first call', (done) => {
    const event = randomUUID();

    const cb = jest.fn();
    const spy = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => ({ data: '' }));
        store.on(event, (_, data) => {
          spy();
          return { data };
        });
      },
    ]);

    const off = connect('data', cb);

    connectPage(() => {
      dispatch(event, 'one');
      off();
      dispatch(event, 'two');

      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith({ data: 'one' });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should connect twice', (done) => {
    const event = randomUUID();

    const cb = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on(event, () => ({ z: 1 }));
      },
    ]);

    connect('z', cb);
    connect('z', cb);

    connectPage(() => {
      expect(cb).toHaveBeenCalledTimes(0);
      dispatch(event);
      expect(cb).toHaveBeenCalledTimes(2);
      expect(cb).toHaveBeenCalledWith({ z: 1 });
      done();
    });
  });

  it('should get the actual current data', (done) => {
    const spy = jest.fn();

    const { connect } = createStoreon([
      (store) => {
        store.on('@init', () => {
          spy();
          return { i: 0 };
        });

        store.on('@ready', (state) => {
          spy();
          expect(state).toEqual({ i: 0 });
          return { i: 1 };
        });
      },
    ]);

    connect('i', (state) => {
      expect(state).toEqual({ i: 1 });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should not be affected connect if use dispatch in @ready', (done) => {
    const event = randomUUID();

    const spy = jest.fn();

    const { dispatch, connect } = createStoreon([
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
      expect(state).toEqual({ t: 2 });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should not run with @ready event if set up inside connectPage method', (done) => {
    const event = randomUUID();

    const cbOutside = jest.fn();
    const cbInside = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on(event, () => ({ a: 'text' }));
      },
    ]);

    connect('a', cbOutside);

    connectPage(() => {
      connect('a', cbInside);

      setTimeout(() => {
        dispatch(event);

        expect(cbOutside).toHaveBeenCalledTimes(2);
        expect(cbInside).toHaveBeenCalledTimes(1);
        expect(cbInside).toHaveBeenCalledWith({ a: 'text' });
        done();
      }, 5);
    });
  });
});
