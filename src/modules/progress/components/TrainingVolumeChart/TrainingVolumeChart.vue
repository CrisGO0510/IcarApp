<template>
  <VueApexCharts type="line" height="240" :options="options" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import type { VolumePoint } from '../../types/progress.types';
import { useTrainingVolumeChart } from './TrainingVolumeChart';

const props = defineProps<{ points: VolumePoint[] }>();

const { series, options } = useTrainingVolumeChart(props);
</script>
