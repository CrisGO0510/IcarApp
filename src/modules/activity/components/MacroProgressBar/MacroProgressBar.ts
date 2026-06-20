import { computed } from 'vue';
import type { MacroProgress } from '../../types/activity.types';

interface Props {
  label: string;
  progress: MacroProgress;
  unit: string;
}

export function useMacroProgressBar(props: Props) {
  const hasGoal = computed(() => props.progress.goal !== null);

  const ratio = computed(() => {
    const pct = props.progress.percentage;
    return pct === null ? 0 : Math.min(pct / 100, 1);
  });

  const isOver = computed(() => (props.progress.percentage ?? 0) > 100);

  const valueLabel = computed(() => {
    const { consumed, goal } = props.progress;
    return goal === null ? `${consumed}${props.unit}` : `${consumed}/${goal}${props.unit}`;
  });

  return { hasGoal, ratio, isOver, valueLabel };
}
