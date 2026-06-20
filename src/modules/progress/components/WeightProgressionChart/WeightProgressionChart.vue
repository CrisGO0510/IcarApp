<template>
  <VueApexCharts type="area" height="220" :options="options" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import type { TimeSeriesPoint } from '../../types/progress.types';
import { useWeightProgressionChart } from './WeightProgressionChart';

const props = defineProps<{ points: TimeSeriesPoint[] }>();

const { series, options } = useWeightProgressionChart(props);
</script>
