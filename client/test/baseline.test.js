import test from 'node:test';
import assert from 'node:assert';

test('client baseline test: test runner is working', () => {
  assert.strictEqual(typeof test, 'function');
  assert.strictEqual(1 + 1, 2);
});
