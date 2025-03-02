/* eslint-disable no-undef */
// const testBuyEvent = require('../testBuyEvent.js')
import { testBuyEvent } from '../testBuyEvent.js'

describe('checking that a sum is correctly calculated', () => {
  test('sum 1 + 2 = 3', () => {
    // 1 assertion
    expect(testBuyEvent(1, 2)).toBe(3);
  });
})