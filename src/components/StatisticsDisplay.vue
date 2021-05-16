<template>
  <div>
    <!--for reactivity-->
    <div v-for="monthData in [['selectedMonthData']]" :key="monthData">
      <h2 class="mb-4 font-extrabold text-center">
        {{ statisticsName }}
      </h2>
      <custom-chart
        class="mb-6"
        :data="[...Object.values(statistics)]"
        :labels="[...Object.keys(statistics)]"
        :canvasId="statisticsName"
      />
    </div>
    <ul class="mb-6">
      <li class="flex items-center mb-2" v-for="category in Object.keys(statistics)" :key="category">
        <div class="rounded-2xl h-5 w-5 mr-2" :style="`background: ${getCategoryColor(category)}`" />
        <p class="text-sm">{{ getStatisticsLabel(category) }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { statisticsColors } from '@/utils/consts';
import { Component, Prop, Vue } from 'vue-property-decorator';
import CustomChart from '@/components/CustomChart.vue';

@Component({
  components: { CustomChart }
})
export default class StatisticsDisplay extends Vue {
  @Prop() products!: number;
  @Prop() statistics!: { [category: string]: number };
  @Prop() statisticsName!: string;
  @Prop({ default: false }) isForWasted: boolean;

  getCategoryColor(category: string) {
    return statisticsColors[category] === undefined ? statisticsColors.other : statisticsColors[category];
  }

  getCategoryPercentage(category: string) {
    category = category.toLowerCase();
    return ((this.statistics[category] / this.products) * 100).toFixed();
  }

  getStatisticsLabel(category: string) {
    const food = this.isForWasted ? 'food waste' : 'food';
    return `${this.getCategoryPercentage(category)}% of all ${food} were ${category}`;
  }
}
</script>
