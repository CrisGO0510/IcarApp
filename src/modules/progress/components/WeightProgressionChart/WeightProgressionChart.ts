import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';
import type { TimeSeriesPoint } from '../../types/progress.types';

interface Props {
  points: TimeSeriesPoint[];
}

export function useWeightProgressionChart(props: Props) {
  const series = computed(() => [{ name: 'Peso', data: props.points.map((point) => point.value) }]);

  const options = computed<ApexOptions>(() => ({
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
      parentHeightOffset: 0,
      animations: { enabled: true },
    },
    theme: { mode: 'dark' },
    colors: ['#3879fa'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] },
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.06)',
      strokeDashArray: 4,
      padding: { left: 8, right: 8 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: props.points.map((point) => point.label),
      labels: { style: { colors: '#a1a1aa' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tickAmount: 6,
      tooltip: { enabled: false },
    },
    yaxis: { show: false },
    tooltip: { theme: 'dark', y: { formatter: (value: number) => `${value} kg` } },
  }));

  return { series, options };
}
