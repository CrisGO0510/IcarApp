import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import type { VolumePoint } from '../../types/progress.types';
import { chartTheme } from '../chartTheme';

interface Props {
  points: VolumePoint[];
}

export function useTrainingVolumeChart(props: Props) {
  const series = computed(() => [
    { name: 'Series', data: props.points.map((point) => point.sets) },
    { name: 'Peso [kg]', data: props.points.map((point) => point.weight) },
  ]);

  const options = computed<ApexOptions>(() => ({
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
      parentHeightOffset: 0,
    },
    theme: { mode: 'dark' },
    colors: [chartTheme.series, chartTheme.weight],
    stroke: { curve: 'smooth', width: [chartTheme.strokeSeries, chartTheme.strokeWeight] },
    markers: { size: 4, strokeWidth: 0 },
    grid: { borderColor: chartTheme.grid, strokeDashArray: 4 },
    dataLabels: { enabled: false },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: chartTheme.axisLabel } },
    xaxis: {
      categories: props.points.map((point) => point.label),
      labels: { style: { colors: chartTheme.axisLabel } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: 'Series',
        labels: { style: { colors: chartTheme.axisLabel } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      {
        seriesName: 'Peso [kg]',
        opposite: true,
        labels: { style: { colors: chartTheme.axisLabel } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
    ],
    tooltip: { theme: 'dark' },
  }));

  return { series, options };
}
