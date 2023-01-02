import { createStoreon } from '../..';

describe('@ready event', () => {
  it('should run @ready event', (done) => {
    createStoreon([
      (store) => {
        store.on('@ready', (state) => {
          expect(state).toEqual({});
          done();
        });
      },
    ]);
  });

  it('should run with the initial state', (done) => {
    createStoreon([
      (store) => {
        store.on('@init', () => ({ xyz: true }));
        store.on('@ready', (state) => {
          expect(state).toEqual({ xyz: true });
          done();
        });
      },
    ]);
  });

  it('should set the initial state instead @init', (done) => {
    const { connect } = createStoreon([
      (store) => {
        store.on('@ready', () => ({ some: [] }));
      },
    ]);

    connect('some', (state) => {
      expect(state).toEqual({ some: [] });
      done();
    });
  });

  it('should get the initial state from @ready event in connectPage', (done) => {
    const { connectPage } = createStoreon([
      (store) => {
        store.on('@ready', () => ({ data: {} }));
      },
    ]);

    connectPage((state) => {
      expect(state).toEqual({ data: {} });
      done();
    });
  });

  it('should update state but should not affect connectPage method', (done) => {
    const { connectPage } = createStoreon([
      (store) => {
        store.on('@init', () => ({ key1: 'key1' }));
        store.on('@ready', () => ({ key2: 'key2' }));
      },
    ]);

    connectPage((state) => {
      expect(state).toEqual({ key1: 'key1', key2: 'key2' });
      done();
    });
  });

  it('should update state but should not affect connect method', (done) => {
    const { connect } = createStoreon([
      (store) => {
        store.on('@init', () => ({ one: 'one' }));
        store.on('@ready', () => ({ two: 'two' }));
      },
    ]);

    connect('one', 'two', (state) => {
      expect(state).toEqual({ one: 'one', two: 'two' });
      done();
    });
  });
});
