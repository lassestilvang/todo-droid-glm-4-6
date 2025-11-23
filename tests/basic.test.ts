import { test, expect } from 'bun:test';

test('basic math test', () => {
  expect(2 + 2).toBe(4);
});

test('string manipulation test', () => {
  const str = 'hello world';
  expect(str.toUpperCase()).toBe('HELLO WORLD');
});

test('array operations test', () => {
  const arr = [1, 2, 3, 4, 5];
  expect(arr.filter(x => x > 3)).toEqual([4, 5]);
});

test('date operations test', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  expect(tomorrow.getTime()).toBeGreaterThan(today.getTime());
});
