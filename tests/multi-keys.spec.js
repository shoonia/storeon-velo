require('./mock.js');

const { createStoreon } = require('..');

describe('Multi keys', () => {
  it('should call the cb two times', (done) => {
    const eventOne = 'event-one';
    const eventTwo = 'event-two';

    const cb = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on(eventOne, (_, x) => ({ x }));
        store.on(eventTwo, (_, y) => ({ y }));
      },
    ]);

    connectPage(() => {
      connect('x', 'y', cb);
      dispatch(eventOne, 1);
      dispatch(eventTwo, 1);

      expect(cb).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should run one time of change two properties synchronic', (done) => {
    const event = '%event';

    const cb = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
      (store) => {
        store.on(event, () => ({ x: '1', y: '1' }));
      },
    ]);

    connectPage(() => {
      connect('x', 'y', cb);
      dispatch(event);

      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveBeenCalledWith({ x: '1', y: '1' });
      done();
    });
  });

  it('should be disconnected', (done) => {
    const eventOne = '#event-one';
    const eventTwo = '#event-two';

    const cb = jest.fn();
    const spy = jest.fn();

    const { dispatch, connect, connectPage } = createStoreon([
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

    connectPage(() => {
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
      done();
    });
  });
});
