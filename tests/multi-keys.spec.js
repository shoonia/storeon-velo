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

    connect('x', 'y', cb);

    connectPage(() => {
      dispatch(eventOne, 1);
      dispatch(eventTwo, 1);

      expect(cb).toHaveBeenCalledTimes(2);
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

    const off = connect('x', 'y', cb);

    connectPage(() => {
      dispatch(eventOne);
      dispatch(eventTwo);

      expect(cb).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledTimes(2);

      off();

      dispatch(eventOne);
      dispatch(eventTwo);

      expect(cb).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledTimes(4);
      done();
    });
  });
});
