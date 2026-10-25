const test = require('node:test');
const assert = require('node:assert');

test('baseline test: test runner is working', () => {
  assert.strictEqual(typeof test, 'function');
  assert.strictEqual(1 + 1, 2);
});
