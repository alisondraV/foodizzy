<template>
  <div>
    <v-header heading="" />
    <div class="mt-20 mb-24 mx-8 flex flex-col text-primary-text">
      <h1 class="text-3xl mb-2 font-extrabold">Welcome, {{ firstName }}!</h1>
      <h2 class="mb-4 font-extrabold">Track your food waste here</h2>
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
      <p v-if="loading" class="text-secondary-text text-center mb-6">Loading...</p>
      <div v-else>
        <div v-if="totalProducts === 0">
          <p class="text-secondary-text text-center text-sm mb-6">
            We don't have enough data to display, go fill your storage!
          </p>
        </div>
        <div v-else>
          <statistics-display
            statistics-name="Products Added"
            :products="totalProducts"
            :statistics="totalProductsForMonth"
          />
          <progress-bar class="mb-8" :label="progressBarLabel" :percentage="getWastePercentage()" />
          <div v-if="Object.keys(statistics).length !== 0 && !loading">
            <statistics-display
              statistics-name="Products Wasted"
              :products="wastedProducts.length"
              :statistics="statistics"
              :is-for-wasted="true"
            />
          </div>
        </div>
      </div>
    </div>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CurrentFamily, WastedProduct } from '@/types';
import { CustomChart, NavigationMenu, ProgressBar, StatisticsDisplay, VHeader } from '@/components';
import Authentication from '@/utils/Authentication';
import { monthList } from '@/utils/consts';

@Component({
  components: {
    StatisticsDisplay,
    CustomChart,
    NavigationMenu,
    ProgressBar,
    VHeader
  }
})
export default class Home extends Vue {
  monthData: { month: number; year: number }[] = [];
  wastedProducts: WastedProduct[] = [];
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
        product.dateWasted &&
        product.dateWasted.toDate().getMonth() == this.selectedMonthData.month &&
        product.dateWasted.toDate().getFullYear() == this.selectedMonthData.year
      );
    });
  }

  get month() {
    return monthList[this.selectedMonthData.month];
  }

  get progressBarLabel() {
    return `${this.getWastePercentage()}% of all food was not wasted in ${this.month}`;
  }

  get statistics() {
    type Category = { [category: string]: number };

    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category.toLowerCase();
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = 0;
      }
      acc[categoryName]++;

      return acc;
    }, {});
  }

  get totalProducts() {
    return Object.values(this.totalProductsForMonth).reduce((acc, e) => e + acc, 0);
  }

  getWastePercentage() {
    const totalWaste = Object.values(this.statistics).reduce((acc, e) => e + acc, 0);
    return ((1 - totalWaste / this.totalProducts) * 100).toFixed();
  }
}
</script>
