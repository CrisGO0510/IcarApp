import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';

export const SWIPE_SIDES = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type SwipeSide = (typeof SWIPE_SIDES)[keyof typeof SWIPE_SIDES];

export interface SwipeSidesMap {
  primarySide: SwipeSide;
  deleteSide: SwipeSide;
  singleDeleteSide: SwipeSide;
}

export function resolveSwipeSides(inverted: boolean): SwipeSidesMap {
  return {
    primarySide: inverted ? SWIPE_SIDES.RIGHT : SWIPE_SIDES.LEFT,
    deleteSide: inverted ? SWIPE_SIDES.LEFT : SWIPE_SIDES.RIGHT,
    singleDeleteSide: inverted ? SWIPE_SIDES.RIGHT : SWIPE_SIDES.LEFT,
  };
}

export function useSwipeSides() {
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);

  onMounted(async () => {
    if (!profile.value) {
      await profileStore.loadProfile();
    }
  });

  const sides = computed(() => resolveSwipeSides(profile.value?.invertSwipeActions === true));

  return {
    primarySide: computed(() => sides.value.primarySide),
    deleteSide: computed(() => sides.value.deleteSide),
    singleDeleteSide: computed(() => sides.value.singleDeleteSide),
  };
}
