<template>
  <canvas :id="canvasId" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Chart from 'chart.js'



@Component
export default class DoughnutChart extends Vue {
  @Prop({ default: [] }) readonly labels!: Array<string>
  @Prop({ default: [] }) readonly colors!: Array<string>
  @Prop({ default: [] }) readonly data!: Array<number>
  @Prop({
    default: () => {
      return Chart.defaults.doughnut
    }
  })
  readonly options: object | undefined
  @Prop() centerNumber: number;
  @Prop() canvasId: string;

  mounted() {
    const centerNumber = this.centerNumber;
    Chart.defaults.CentralDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
    Chart.controllers.CentralDoughnut = Chart.controllers.doughnut.extend({
        name: "CentralDoughnut",
        showTooltip: function({...parameters}) {
            this.chart.ctx.save();
            Chart.controllers.doughnut.prototype.showTooltip.apply(this, parameters);
            this.chart.ctx.restore();
        },
        draw: function({ ...parameters}) {
            Chart.controllers.doughnut.prototype.draw.apply(this, parameters);

            const width = this.chart.width,
                height = this.chart.height;

            const fontSize = (height / 114).toFixed(2);
            this.chart.ctx.font = fontSize + "em Poppins";
            this.chart.ctx.textBaseline = "middle";

            const text = (centerNumber * 100).toFixed(1) + '%',
                textX = Math.round((width - this.chart.ctx.measureText(text).width) / 2),
                textY = height / 2;

            this.chart.ctx.fillText(text, textX, textY);
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
    })
  }

  createChart(chartData: object) {
    const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement
    const options = {
      type: 'CentralDoughnut',
      data: chartData,
      borderWidth: 1,
      borderColor: '#ff0',
      options: { 
        ...this.options,
        cutoutPercentage: 80,
        legend: {
          display: false
        }
      }
    }
    new Chart(canvas, options)
  }
}
</script>