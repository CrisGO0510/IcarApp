import { computed } from 'vue';
import type { LastWorkout } from '../../types/activity.types';

interface Props {
  workout: LastWorkout;
}

export function useLastWorkoutCard(props: Props) {
  const tag = computed(() => {
    const performed = props.workout.performedAt;
    const today = new Date();
    const sameDay =
      performed.getFullYear() === today.getFullYear() &&
      performed.getMonth() === today.getMonth() &&
      performed.getDate() === today.getDate();

    const dayLabel = sameDay
      ? 'Hoy'
      : new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' }).format(performed);
    const timeLabel = new Intl.DateTimeFormat('es', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(performed);

    return `${dayLabel} • ${timeLabel}`;
  });

  const exerciseCount = computed(() => props.workout.exercises.length);

  return { tag, exerciseCount };
}
