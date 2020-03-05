describe('import', () => {
  it('should import storeon core', () => {
    const { storeon } = require('../dist');

    const { on, get, dispatch } = storeon([]);

    expect(typeof on === 'function').toBeTruthy();
    expect(typeof get === 'function').toBeTruthy();
    expect(typeof dispatch === 'function').toBeTruthy();
  });
});
