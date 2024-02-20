import { createStoreon } from '..';

describe('@ready event', () => {
  it('should run @ready event', (done) => {
    expect.hasAssertions();

    const { readyStore } = createStoreon([
      (store) => {
        store.on('@ready', (state) => {
          expect(state).toStrictEqual({});
          done();
        });
      },
    ]);

    readyStore();
  });

  it('should run with the initial state', (done) => {
    expect.hasAssertions();

    const { readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ xyz: true }));
        store.on('@ready', (state) => {
          expect(state).toStrictEqual({ xyz: true });
          done();
        });
      },
    ]);

    readyStore();
  });

  it('should set the initial state instead @init', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@ready', () => ({ some: [] }));
      },
    ]);

    connect('some', (state) => {
      expect(state).toStrictEqual({ some: [] });
      done();
    });

    readyStore();
  });


  it('should update state but should not affect connect method', (done) => {
    expect.hasAssertions();

    const { connect, readyStore } = createStoreon([
      (store) => {
        store.on('@init', () => ({ one: 'one' }));
        store.on('@ready', () => ({ two: 'two' }));
      },
    ]);

    connect('one', 'two', (state) => {
      expect(state).toStrictEqual({ one: 'one', two: 'two' });
      done();
    });

    readyStore();
  });
});
