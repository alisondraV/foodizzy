<template>
  <div>
    <v-header heading="" />
    <div class="mt-20 mb-20 mx-8 flex flex-col text-primary-text">
      <h1 class="text-3xl mb-2 font-extrabold">Welcome, {{ firstName }}!</h1>
      <h2 class="mb-4 font-extrabold">
        Track your food waste here
      </h2>
      <div class="text-right w-full mb-4">
        <label>
          <select
            class="form-select border-none"
            v-model="selectedMonthData"
            @change="getWastedProductsForSelectedMonth"
          >
            <option v-for="data in monthData" :value="data" :key="`${data.month}-${data.year}`">
              {{ getMonthDataString(data.month, data.year) }}
            </option>
          </select>
        </label>
      </div>
      <p v-if="loading" class="text-secondary-text text-center mb-6">
        Loading...
      </p>
      <div v-else>
        <div v-if="totalProducts === 0">
          <p class="text-secondary-text text-center text-sm mb-6">
            We don't have enough data to display, go fill your fridge!
          </p>
        </div>
        <div v-else>
          <!--for reactivity-->
          <div v-for="chart in chartData" :key="chart.length">
            <custom-chart
              v-if="chart.length !== 0"
              class="mb-6"
              :data="chart"
              :labels="chartLabels"
              :colors="[...Object.values(categoryColors)]"
              canvasId="main"
            />
          </div>
          <ul class="mb-6">
            <li class="flex items-center mb-2" v-for="category in Object.keys(statistics)" :key="category">
              <div class="rounded-2xl h-5 w-5 mr-2" :style="`background: ${categoryColors[category]}`" />
              <p>{{ getWastePercentage(category) }}% of all food waste was {{ category }}</p>
            </li>
          </ul>
          <progress-bar :label="label" :percentage="getWastePercentage()" />
        </div>
      </div>
    </div>
    <navigation-menu current-page="Home" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CurrentFamily, WastedProduct } from '@/types';
import { CustomChart, NavigationMenu, ProgressBar, VHeader } from '@/components';
import { colors, monthList } from '@/utils/consts';
import Authentication from '@/utils/Authentication';

@Component({
  components: {
    CustomChart,
    NavigationMenu,
    ProgressBar,
    VHeader
  }
})
export default class Home extends Vue {
  monthData: { month: number; year: number }[] = [];
  wastedProducts: WastedProduct[] = [];
  categoryColors: { [category: string]: string } = {};
  totalProductsForMonth: { [category: string]: number } = {};
  firstName = '';
  loading = true;
  selectedMonthData = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };

  async mounted() {
    this.firstName = await Authentication.instance.getFirstName();
    await this.getWastedProductsForSelectedMonth();
    await this.getMonthData();
    this.loading = false;
  }

  async getMonthData() {
    const availableMonthData = await CurrentFamily.instance.getAvailableMonthData();
    this.monthData = availableMonthData;

    const currentMonthIsPresent = Boolean(
      availableMonthData.find(
        data => data.month === this.selectedMonthData.month && data.year === this.selectedMonthData.year
      )
    );

    if (!currentMonthIsPresent) {
      this.monthData.push(this.selectedMonthData);
    }

    this.monthData.sort((data1, data2) => {
      if (data1.year === data2.year) {
        return data2.month - data1.month;
      }
      return data2.year - data1.year;
    });
  }

  async getTotalProductsForMonth() {
    this.totalProductsForMonth = await CurrentFamily.instance.getStatisticsForThisMonth(
      this.selectedMonthData
    );
  }

  getMonthDataString(month: number, year: number) {
    return `${monthList[month]} ${year}`;
  }

  async getWastedProductsForSelectedMonth() {
    await this.getTotalProductsForMonth();
    const allWastedProducts = await CurrentFamily.instance.getWastedProducts();

    this.wastedProducts = allWastedProducts.filter((product: WastedProduct) => {
      return (
        product.dateWasted.toDate().getMonth() == this.selectedMonthData.month &&
        product.dateWasted.toDate().getFullYear() == this.selectedMonthData.year
      );
    });
  }

  get month() {
    return monthList[this.selectedMonthData.month];
  }

  get label() {
    return `${this.getWastePercentage()}% of all food was not wasted in ${this.month}`;
  }

  get statistics() {
    type Category = { [category: string]: number };
    let categoryCount = 0;

    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = (product.category ?? 'General').toLowerCase();
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = 0;
        this.categoryColors[categoryName] = colors[categoryCount];
        categoryCount++;
      }

      acc[categoryName]++;

      return acc;
    }, {});
  }

  get totalProducts() {
    return Object.values(this.totalProductsForMonth).reduce((acc, e) => e + acc, 0);
  }

  get totalWaste() {
    return Object.values(this.statistics).reduce((acc, e) => e + acc, 0);
  }

  get chartData() {
    return [[...Object.values(this.statistics)]];
  }

  get chartLabels() {
    return [...Object.keys(this.statistics)];
  }

  getWastePercentage(category?: string) {
    if (category) {
      category = category.toLowerCase();
      return ((this.statistics[category] / this.wastedProducts.length) * 100).toFixed();
    }
    return ((1 - this.totalWaste / this.totalProducts) * 100).toFixed();
  }
}
</script>
