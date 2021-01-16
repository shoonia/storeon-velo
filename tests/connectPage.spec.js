require('./mock.js');

const { createStoreon } = require('..');

describe('connectPage method', () => {
  it('should run connectPage method', (done) => {
    const { connectPage } = createStoreon([]);

    connectPage((state) => {
      expect(state).toEqual({});
      done();
    });
  });

  it('should get correctly state for each connectPage', (done) => {
    const event = 'event+event';
    const spy = jest.fn();

    const { dispatch, connectPage } = createStoreon([
      (store) => store.on(event, (_, i) => ({ i })),
    ]);

    dispatch(event, '01');

    connectPage((state) => {
      spy();
      expect(state).toEqual({ i: '01' });
      dispatch(event, '02');
    });

    connectPage((state) => {
      spy();
      expect(state).toEqual({ i: '02' });
      dispatch(event, '03');
    });

    connectPage((state) => {
      expect(state).toEqual({ i: '03' });
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
