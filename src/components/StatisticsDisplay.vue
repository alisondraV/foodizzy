<template>
  <div>
    <!--for reactivity-->
    <div v-for="(_, index) in [['selectedMonthData']]" :key="index">
      <h2 class="mb-4 font-extrabold text-center">
        {{ statisticsName }}
      </h2>
      <custom-chart
        class="mb-6"
        :data="[...Object.values(filteredStatistics)]"
        :labels="[...Object.keys(filteredStatistics)]"
        :canvasId="statisticsName"
      />
    </div>
    <ul class="mb-6">
      <li
        :class="`flex items-center mb-2 text-sm ${category === 'miscellaneous' ? 'mt-4' : ''}`"
        v-for="category in Object.keys(filteredStatistics)"
        :key="category"
      >
        <div class="rounded-2xl h-5 w-5 mr-2" :style="`background: ${getCategoryColor(category)}`" />
        <p>{{ getFilteredStatisticsLabel(category) }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CustomChart from '@/components/CustomChart.vue';
import { statisticsColors } from '@/utils/consts';

@Component({
  components: { CustomChart }
})
export default class StatisticsDisplay extends Vue {
  @Prop() products!: number;
  @Prop() statistics!: { [category: string]: number };
  @Prop() statisticsName!: string;
  @Prop({ default: false }) isForWasted?: boolean;

  filteredStatistics: { [category: string]: number } = this.getSortedAndFilteredStatistics();

  getOriginalCategoryPercentage(category: string) {
    category = category.toLowerCase();
    return (this.statistics[category] / this.products) * 100;
  }

  getFilteredCategoryPercentage(category: string) {
    category = category.toLowerCase();
    return (this.getSortedAndFilteredStatistics()[category] / this.products) * 100;
  }

  getFilteredStatisticsLabel(category: string) {
    const food = this.isForWasted ? 'food waste' : 'food';
    return `${this.getFilteredCategoryPercentage(category).toFixed()}% of all ${food} were ${category}`;
  }

  private getSortedAndFilteredStatistics() {
    const sortedStatistics = Object.entries(this.statistics).sort(
      (category, nextCategory) => nextCategory[1] - category[1]
    );
    const filteredStats = sortedStatistics.filter(item => this.getOriginalCategoryPercentage(item[0]) > 5);
    
    const miscellaneousCategory = sortedStatistics
      .filter(item => this.getOriginalCategoryPercentage(item[0]) <= 5)
      .reduce((prev, acc) => ['miscellaneous', prev[1] + acc[1]], ['miscellaneous', 0]);


    const filteredStatsWithMiscCategory =
      miscellaneousCategory[1] !== 0 ? [...filteredStats, miscellaneousCategory] : filteredStats;

    return Object.fromEntries(filteredStatsWithMiscCategory);
  }

  getCategoryColor(category: string) {
    return statisticsColors[category] === undefined ? statisticsColors.other : statisticsColors[category];
  }
}
</script>
