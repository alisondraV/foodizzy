<template>
  <div>
    <v-header heading="Waste Report" />
    <div
      class="mt-20 mb-20 mx-8 flex flex-col"
      v-if="wastedProducts && wastedProducts.length > 0"
    >
      <DonutChart
        :data="chartData"
        :labels="chartLabels"
        :colors="[defaultColor, ...Object.values(categoryColors)]"
        :centerNumber="getWastePercentage()"
        canvasId="main"
      >
      </DonutChart>
      <div
        v-for="category in Object.keys(statistics)"
        :key="category"
        class="h-30 w-40 flex flex-row"
      >
        <DonutChart
          :data="[
            statistics[category.toLowerCase()],
            family.totalProducts[category.toLowerCase()] -
              statistics[category.toLowerCase()]
          ]"
          :labels="['wasted', 'eaten']"
          :colors="[categoryColors[category.toLowerCase()], defaultColor]"
          :centerNumber="getWastePercentage(category)"
          :canvasId="category.toLowerCase()"
        >
        </DonutChart>
        <p class="flex-1">of all {{ category }} was wasted</p>
        <hr />
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
    DonutChart
  }
})
export default class Home extends Vue {
  family: Family | null = null;
  user: firebase.User | null = null;
  wastedProducts: WastedProduct[] = [];
  colors: string[] = ["#01877E", "#FFB0A9", "#F9D678", "#383838"];
  defaultColor = "#E7E7E7";
  categoryColors: { [category: string]: string } = {};

  async mounted() {
    this.user = await Authentication.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    await this.getWastedForFamily();
  }

  async getWastedForFamily() {
    this.wastedProducts = await Firestore.instance.getWastedForFamily(
      this.family
    );
  }

  get statistics() {
    type Category = { [category: string]: number };
    let categoryCount = 0;
    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = (product.category ?? "general").toLowerCase();
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
      ...Object.values(this.statistics)
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
