<template>
  <div>
    <v-header heading="" />
    <div class="mt-20 mb-20 mx-8 flex flex-col">
      <h1 class="text-3xl mb-2 font-extrabold text-primary-text">
        Welcome, {{ firstName }}!
      </h1>
      <h2 class="mb-4 font-extrabold text-primary-text">
        Track your food waste here
      </h2>
      <div class="text-right w-full mb-4 text-primary-text">
        <label>
          <select
            v-model="selectedMonthData"
            @change="getWastedProductsForSelectedMonth"
          >
            <option
              v-for="data in monthData"
              :value="data"
              :key="`${data.month}-${data.year}`"
            >
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
          <p class="text-secondary-text text-center mb-6">
            We don't have enough data to display, go fill your fridge!
          </p>
        </div>
        <div v-else>
          <div v-for="chart in chartData" :key="chart[0]">
            <DonutChart
              class="mb-6"
              :data="chart"
              :labels="chartLabels"
              :colors="[defaultColor, ...Object.values(categoryColors)]"
              :centerNumber="getWastePercentage()"
              canvasId="main"
            >
            </DonutChart>
          </div>
          <p class="text-secondary-text text-center mb-6">
            {{ (getWastePercentage() * 100).toFixed() }}% of all food was wasted
            in
            {{ month }}
          </p>
          <div
            v-for="category in Object.keys(statistics)"
            :key="category"
            class="flex mb-6 items-center w-full"
          >
            <div class="h-30 w-40 flex items-center">
              <DonutChart
                :data="[
                  statistics[category.toLowerCase()],
                  totalProductsForMonth[category.toLowerCase()] -
                    statistics[category.toLowerCase()]
                ]"
                :labels="['wasted', 'eaten']"
                :colors="[categoryColors[category.toLowerCase()], defaultColor]"
                :centerNumber="getWastePercentage(category)"
                :canvasId="category.toLowerCase()"
              >
              </DonutChart>
            </div>
            <p class="text-primary-text">of all {{ category }} was wasted</p>
          </div>
        </div>
      </div>
    </div>
    <navigation-menu current-page="Home" />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import WastedProduct from "@/types/WastedProduct";
import VHeader from "@/components/VHeader.vue";
import firebase from "firebase";
import DonutChart from "@/components/DonutChart.vue";
import {colors, monthList} from "@/utils/consts";

@Component({
  components: {
    VHeader,
    NavigationMenu,
    DonutChart
  }
})
export default class Home extends Vue {
  loading = true;
  monthData: { month: number; year: number }[] = [];
  user: firebase.User | null = null;
  wastedProducts: WastedProduct[] = [];
  categoryColors: { [category: string]: string } = {};
  totalProductsForMonth: { [category: string]: number } = {};

  selectedMonthData = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  };
  firstName = "";
  defaultColor = "#E7E7E7";

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    if (this.user!.displayName) {
      this.firstName =
        this.user!.displayName.substr(
          0,
          this.user!.displayName?.indexOf(" ")
        ) || this.user!.displayName;
    }
    await this.getWastedProductsForSelectedMonth();
    this.monthData = await Firestore.instance.getAvailableMonthData();
    this.loading = false;
  }

  async getTotalProductsForMonth() {
    this.totalProductsForMonth = await Firestore.instance.getStatisticsForThisMonth(
      this.selectedMonthData
    );
  }

  getMonthDataString(month: number, year: number) {
    return `${monthList[month]} ${year}`;
  }

  async getWastedProductsForSelectedMonth() {
    await this.getTotalProductsForMonth();
    const allWastedProducts = await Firestore.instance.getWastedForFamily();

    this.wastedProducts = allWastedProducts.filter((product: WastedProduct) => {
      return (
        product.dateWasted.toDate().getMonth() ==
          this.selectedMonthData.month &&
        product.dateWasted.toDate().getFullYear() == this.selectedMonthData.year
      );
    });
  }

  get month() {
    return monthList[this.selectedMonthData.month];
  }

  get statistics() {
    type Category = { [category: string]: number };
    let categoryCount = 0;

    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = (product.category ?? "General").toLowerCase();
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
    return Object.values(this.totalProductsForMonth).reduce(
      (acc, e) => e + acc,
      0
    );
  }

  get totalWaste() {
    return Object.values(this.statistics).reduce((acc, e) => e + acc, 0);
  }

  get chartData() {
    return [
      [this.totalProducts - this.totalWaste, ...Object.values(this.statistics)]
    ];
  }

  get chartLabels() {
    return ["Eaten", ...Object.keys(this.statistics)];
  }

  getWastePercentage(category?: string) {
    if (category) {
      category = category.toLowerCase();
      return this.statistics[category] / this.totalProductsForMonth[category];
    }
    return this.totalWaste / this.totalProducts;
  }
}
</script>
