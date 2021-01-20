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
      <div v-if="Object.keys(statistics).length === 0">
        <p class="text-secondary-text text-center mb-6">
          We don't have enought data to display, go fill your fridge!
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
          {{ getMonth() }}
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
                family.totalProducts[category.toLowerCase()] -
                  statistics[category.toLowerCase()],
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

@Component({
  components: {
    VHeader,
    NavigationMenu,
    DonutChart,
  },
})
export default class Home extends Vue {
  family: Family | null = null;
  user: firebase.User | null = null;
  wastedProducts: WastedProduct[] = [];
  categoryColors: { [category: string]: string } = {};

  firstName = "";
  defaultColor = "#E7E7E7";
  colors: string[] = ["#01877E", "#FFB0A9", "#F9D678", "#383838"];
  monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  async mounted() {
    this.user = await Authentication.getCurrentUser();

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    console.log(this.user!.uid);

    if (this.user.displayName) {
      this.firstName = this.user!.displayName.substr(
        0,
        this.user.displayName?.indexOf(" ")
      );
    }
    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    await this.getWastedForFamily();
  }

  async getWastedForFamily() {
    this.wastedProducts = await Firestore.instance.getWastedForFamily(
      this.family
    );
  }

  getMonth() {
    return this.monthList[new Date().getMonth()];
  }

  get statistics() {
    type Category = { [category: string]: number };
    let categoryCount = 0;
    console.log(this.wastedProducts);

    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = (product.category ?? "General").toLowerCase();
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = 0;
        this.categoryColors[categoryName] = this.colors[categoryCount];
        categoryCount++;
      }

      acc[categoryName]++;

      return acc;
    }, {});
  }

  get totalProducts() {
    return Object.values(this.family!.totalProducts).reduce(
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
      ...Object.values(this.statistics),
    ];
  }

  get chartLabels() {
    return ["Eaten", ...Object.keys(this.statistics)];
  }

  getWastePercentage(category?: string) {
    if (!category) {
      return this.totalWaste / this.totalProducts;
    }
    category = category.toLowerCase();
    return this.statistics[category] / this.family!.totalProducts[category];
  }
}
</script>
