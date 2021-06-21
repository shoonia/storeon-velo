global.$w = {
  onReady(cb) {
    process.nextTick(cb);
  },
};

jest.setTimeout(50);
