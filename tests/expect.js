import { strictEqual, deepStrictEqual } from 'node:assert/strict';

export const expect = (actual) => ({
  toBe: (expected) =>
    strictEqual(actual, expected),

  toStrictEqual: (expected) =>
    deepStrictEqual(actual, expected),

  toHaveBeenCalledTimes: (expected) =>
    deepStrictEqual(actual.mock.callCount(), expected),

  toHaveBeenLastCalledWith: (...expected) =>
    deepStrictEqual(actual.mock.calls.at(-1).arguments, expected),

  toHaveBeenNthCalledWith: (times, ...expected) =>
    deepStrictEqual(actual.mock.calls.at(times === 0 ? 1 : times - 1).arguments, expected),
});
