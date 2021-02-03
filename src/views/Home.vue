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
          <DonutChart
            class="mb-6"
            :data="chartData"
            :labels="chartLabels"
            :colors="[defaultColor, ...Object.values(categoryColors)]"
            :centerNumber="getWastePercentage()"
            canvasId="main"
          >
          </DonutChart>
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
import { Component, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Firestore from "@/utils/Firestore";
import Authentication from "@/utils/Authentication";
import WastedProduct from "@/types/WastedProduct";
import Family from "@/types/Family";
import VHeader from "@/components/VHeader.vue";
import firebase from "firebase";
import DonutChart from "@/components/DonutChart.vue";
import { colors, monthList } from "@/utils/consts";

@Component({
  components: {
    VHeader,
    NavigationMenu,
    DonutChart
  }
})
export default class Home extends Vue {
  loading = true;
  family: Family | null = null;
  user: firebase.User | null = null;
  wastedProducts: WastedProduct[] = [];
  categoryColors: { [category: string]: string } = {};
  totalProductsForMonth: { [category: string]: number } = {};

  firstName = "";
  defaultColor = "#E7E7E7";

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    if (this.user.displayName) {
      this.firstName =
        this.user.displayName.substr(0, this.user.displayName?.indexOf(" ")) ||
        this.user.displayName;
    }
    this.family = await Firestore.instance.getFamilyForUser(this.user);
    this.totalProductsForMonth = await Firestore.instance.getStatisticsForThisMonth(
      this.family
    );
    await this.getWastedProductsForThisMonth();
    this.loading = false;
  }

  async getWastedProductsForThisMonth() {
    const allWastedProducts = await Firestore.instance.getWastedForFamily(
      this.family
    );

    this.wastedProducts = allWastedProducts.filter((product: WastedProduct) => {
      return product.dateWasted.toDate().getMonth() == new Date().getMonth();
    });
  }

  get month() {
    return monthList[new Date().getMonth()];
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
    if (!this.family) {
      return 0;
    }

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
      this.totalProducts - this.totalWaste,
      ...Object.values(this.statistics)
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
