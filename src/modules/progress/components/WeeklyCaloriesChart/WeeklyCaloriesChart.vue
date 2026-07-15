<template>
  <div>
    <div v-if="isEmpty" class="text-center text-muted q-pa-lg">
      Sin registros esta semana. Registra comidas en Nutrición para ver tu progreso.
    </div>
    <template v-else>
      <svg
        :viewBox="viewBox"
        class="weekly-cal"
        role="img"
        aria-label="Calorías consumidas por día frente al límite diario"
      >
        <line
          :x1="paddingX"
          :y1="baselineY"
          :x2="chartRight"
          :y2="baselineY"
          class="weekly-cal__baseline"
        />
        <g v-for="(day, index) in geometry" :key="day.date" @click="select(index)">
          <rect
            class="weekly-cal__hit"
            :x="day.slotX"
            y="0"
            :width="day.slotWidth"
            :height="viewHeight"
          />
          <rect
            v-if="day.zone"
            class="weekly-cal__zone"
            :x="day.slotX"
            :y="day.zone.y"
            :width="day.slotWidth"
            :height="day.zone.height"
          >
            <q-tooltip>{{ day.zone.tooltip }}</q-tooltip>
          </rect>
          <rect
            v-if="day.bar"
            class="weekly-cal__bar"
            :x="day.barX"
            :y="day.bar.y"
            :width="day.barWidth"
            :height="day.bar.height"
            :rx="barRadius"
          >
            <q-tooltip>{{ day.bar.tooltip }}</q-tooltip>
          </rect>
          <rect
            v-if="day.excess"
            class="weekly-cal__excess"
            :x="day.barX"
            :y="day.excess.y"
            :width="day.barWidth"
            :height="day.excess.height"
            :rx="barRadius"
          >
            <q-tooltip>{{ day.excess.tooltip }}</q-tooltip>
          </rect>
          <text
            :x="day.center"
            :y="labelY"
            class="weekly-cal__day"
            :class="{ 'weekly-cal__day--selected': index === selectedIndex }"
          >
            {{ day.label }}
          </text>
        </g>
        <g>
          <line
            v-for="segment in limitSegments"
            :key="segment.x1"
            :x1="segment.x1"
            :y1="segment.y"
            :x2="segment.x2"
            :y2="segment.y"
            class="weekly-cal__limit"
            :class="{ 'weekly-cal__limit--raised': segment.raised }"
          />
          <line
            v-for="connector in limitConnectors"
            :key="connector.x"
            :x1="connector.x"
            :y1="connector.y1"
            :x2="connector.x"
            :y2="connector.y2"
            class="weekly-cal__connector"
          />
          <line
            v-for="(segment, index) in limitSegments"
            :key="`${segment.x1}-hit`"
            :x1="segment.x1"
            :y1="segment.y"
            :x2="segment.x2"
            :y2="segment.y"
            class="weekly-cal__limit-hit"
            @click="select(index)"
          >
            <q-tooltip>{{ segment.tooltip }}</q-tooltip>
          </line>
        </g>
      </svg>
      <div class="text-caption text-muted q-mt-sm">{{ detail }}</div>
      <div v-if="weekly.goal === null" class="text-caption text-muted q-mt-xs">
        Define tu meta calórica en Nutrición para ver el límite diario.
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { WeeklyCalories } from '../../types/progress.types';
import { useWeeklyCaloriesChart } from './WeeklyCaloriesChart';

const props = defineProps<{ weekly: WeeklyCalories }>();

const {
  viewBox,
  viewHeight,
  baselineY,
  labelY,
  barRadius,
  paddingX,
  chartRight,
  geometry,
  limitSegments,
  limitConnectors,
  selectedIndex,
  isEmpty,
  detail,
  select,
} = useWeeklyCaloriesChart(props);
</script>
