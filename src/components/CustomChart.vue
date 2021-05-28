<template>
  <canvas :id="canvasId" />
</template>

<script lang="ts">
import { statisticsColors } from '@/utils/consts';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Chart from 'chart.js';

@Component
export default class CustomChart extends Vue {
  @Prop({ default: [] }) readonly labels!: Array<string>;
  @Prop({ default: [] }) readonly data!: Array<number>;
  @Prop() canvasId!: string;
  readonly options: object | undefined;
  colors: string[] = [];

  mounted() {
    this.colors = this.labels.map(label => statisticsColors[label] ?? statisticsColors.other);

    Chart.defaults.CentralDoughnut = Chart.helpers.clone(Chart.defaults.pie);
    Chart.controllers.CentralDoughnut = Chart.controllers.pie.extend({
      name: 'CentralPie',
      showTooltip: function({ ...parameters }) {
        this.chart.ctx.save();
        Chart.controllers.pie.prototype.showTooltip.apply(this, parameters);
        this.chart.ctx.restore();
      }
    });

    this.createChart({
      datasets: [
        {
          data: this.data,
          backgroundColor: this.colors
        }
      ],
      labels: this.labels
    });
  }

  createChart(chartData: object) {
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
    const options = {
      type: 'CentralDoughnut',
      data: chartData,
      borderWidth: 1,
      options: {
        ...this.options,
        cutoutPercentage: 0,
        legend: {
          display: false
        }
      }
    };
    new Chart(canvas, options);
  }
}
</script>
