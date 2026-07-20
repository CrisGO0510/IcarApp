import { describe, it, expect } from 'vitest';
import { resolveSwipeSides, SWIPE_SIDES } from './useSwipeSides';

describe('resolveSwipeSides', () => {
  it('keeps the current sides when not inverted', () => {
    expect(resolveSwipeSides(false)).toEqual({
      primarySide: SWIPE_SIDES.LEFT,
      deleteSide: SWIPE_SIDES.RIGHT,
      singleDeleteSide: SWIPE_SIDES.LEFT,
    });
  });

  it('swaps every side when inverted', () => {
    expect(resolveSwipeSides(true)).toEqual({
      primarySide: SWIPE_SIDES.RIGHT,
      deleteSide: SWIPE_SIDES.LEFT,
      singleDeleteSide: SWIPE_SIDES.RIGHT,
    });
  });
});
