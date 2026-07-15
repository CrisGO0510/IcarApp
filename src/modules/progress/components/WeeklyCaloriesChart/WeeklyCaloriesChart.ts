import { computed, ref } from 'vue';
import { parseDateKey, todayKey } from 'src/core/utils/dateKey';
import { ENERGY_UNIT } from 'src/modules/nutrition/types/nutrition.types';
import { dayMonthLabel, weekdayLabel } from '../../use-cases/labels';
import type { WeeklyCalories } from '../../types/progress.types';

const LABEL_CONSUMED = 'Consumido';
const LABEL_EXCESS = 'Exceso';
const LABEL_MARGIN = 'Margen por actividad';
const LABEL_DAY_LIMIT = 'Límite del día';
const LABEL_GOAL = 'Meta';
const DETAIL_BURNED = 'quemadas';
const DETAIL_LIMIT = 'límite';
const DETAIL_EXCESS = 'exceso';

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 200;
const PADDING_X = 16;
const CHART_TOP = 16;
const BASELINE_Y = 172;
const LABEL_Y = 190;
const BAR_RADIUS = 4;
const SEGMENT_GAP = 2;
const BAR_WIDTH_RATIO = 0.6;
const MIN_EXCESS_HEIGHT = 2;

const kcal = (value: number): string => `${Math.round(value)} ${ENERGY_UNIT}`;

interface Band {
  y: number;
  height: number;
  tooltip: string;
}

interface DayGeometry {
  date: string;
  label: string;
  slotX: number;
  slotWidth: number;
  center: number;
  barX: number;
  barWidth: number;
  bar: Band | null;
  excess: Band | null;
  zone: Band | null;
}

interface LimitSegment {
  x1: number;
  x2: number;
  y: number;
  raised: boolean;
  tooltip: string;
}

interface LimitConnector {
  x: number;
  y1: number;
  y2: number;
}

interface Props {
  weekly: WeeklyCalories;
}

export function useWeeklyCaloriesChart(props: Props) {
  const selectedOverride = ref<number | null>(null);

  const todayIndex = computed(() => {
    const index = props.weekly.days.findIndex((day) => day.date === todayKey());
    return index === -1 ? props.weekly.days.length - 1 : index;
  });

  const selectedIndex = computed(() => selectedOverride.value ?? todayIndex.value);

  const limitOf = (burned: number): number | null =>
    props.weekly.goal === null ? null : props.weekly.goal + burned;

  const maxValue = computed(() =>
    Math.max(
      1,
      props.weekly.goal ?? 0,
      ...props.weekly.days.map((day) => Math.max(day.consumed, limitOf(day.burned) ?? 0)),
    ),
  );

  const toY = (value: number): number =>
    BASELINE_Y - (value / maxValue.value) * (BASELINE_Y - CHART_TOP);

  const geometry = computed<DayGeometry[]>(() => {
    const slotWidth = (VIEW_WIDTH - PADDING_X * 2) / props.weekly.days.length;
    const barWidth = slotWidth * BAR_WIDTH_RATIO;

    return props.weekly.days.map((day, index) => {
      const slotX = PADDING_X + index * slotWidth;
      const limit = limitOf(day.burned);
      const exceeded = limit !== null && day.consumed > limit;

      const barTopValue = exceeded ? limit : day.consumed;
      const barY = toY(barTopValue);
      const bar: Band | null =
        barTopValue > 0
          ? { y: barY, height: BASELINE_Y - barY, tooltip: `${LABEL_CONSUMED}: ${kcal(day.consumed)}` }
          : null;

      let excess: Band | null = null;
      if (exceeded && limit !== null) {
        const excessY = toY(day.consumed);
        excess = {
          y: excessY,
          height: Math.max(barY - SEGMENT_GAP - excessY, MIN_EXCESS_HEIGHT),
          tooltip: `${LABEL_EXCESS}: ${kcal(day.consumed - limit)}`,
        };
      }

      let zone: Band | null = null;
      if (props.weekly.goal !== null && limit !== null && day.burned > 0 && !exceeded) {
        const zoneY = toY(limit);
        zone = {
          y: zoneY,
          height: toY(props.weekly.goal) - zoneY,
          tooltip: `${LABEL_MARGIN}: +${kcal(day.burned)}`,
        };
      }

      return {
        date: day.date,
        label: day.label,
        slotX,
        slotWidth,
        center: slotX + slotWidth / 2,
        barX: slotX + (slotWidth - barWidth) / 2,
        barWidth,
        bar,
        excess,
        zone,
      };
    });
  });

  const limitSegments = computed<LimitSegment[]>(() => {
    if (props.weekly.goal === null) return [];
    return props.weekly.days.map((day, index) => {
      const slotWidth = (VIEW_WIDTH - PADDING_X * 2) / props.weekly.days.length;
      const x1 = PADDING_X + index * slotWidth;
      const limit = limitOf(day.burned) ?? 0;
      const raised = day.burned > 0;
      return {
        x1,
        x2: x1 + slotWidth,
        y: toY(limit),
        raised,
        tooltip: `${raised ? LABEL_DAY_LIMIT : LABEL_GOAL}: ${kcal(limit)}`,
      };
    });
  });

  const limitConnectors = computed<LimitConnector[]>(() => {
    const connectors: LimitConnector[] = [];
    const segments = limitSegments.value;
    for (let index = 1; index < segments.length; index += 1) {
      const previous = segments[index - 1];
      const current = segments[index];
      if (!previous || !current || previous.y === current.y) continue;
      connectors.push({
        x: current.x1,
        y1: Math.min(previous.y, current.y),
        y2: Math.max(previous.y, current.y),
      });
    }
    return connectors;
  });

  const isEmpty = computed(
    () =>
      props.weekly.goal === null &&
      props.weekly.days.every((day) => day.consumed === 0 && day.burned === 0),
  );

  const detail = computed(() => {
    const day = props.weekly.days[selectedIndex.value];
    if (!day) return '';

    const date = parseDateKey(day.date);
    const limit = limitOf(day.burned);
    const parts = [kcal(day.consumed)];
    if (day.burned > 0) parts.push(`${DETAIL_BURNED} ${Math.round(day.burned)}`);
    if (limit !== null) {
      parts.push(`${DETAIL_LIMIT} ${Math.round(limit)}`);
      if (day.consumed > limit) parts.push(`${DETAIL_EXCESS} ${Math.round(day.consumed - limit)}`);
    }
    return `${weekdayLabel(date)} ${dayMonthLabel(date)}: ${parts.join(' · ')}`;
  });

  function select(index: number): void {
    selectedOverride.value = index;
  }

  return {
    viewBox: `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`,
    viewHeight: VIEW_HEIGHT,
    baselineY: BASELINE_Y,
    labelY: LABEL_Y,
    barRadius: BAR_RADIUS,
    paddingX: PADDING_X,
    chartRight: VIEW_WIDTH - PADDING_X,
    geometry,
    limitSegments,
    limitConnectors,
    selectedIndex,
    isEmpty,
    detail,
    select,
  };
}
