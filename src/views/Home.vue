<template>
  <div>
    <v-header heading="" />
    <div class="mt-20 mb-20 mx-8">
      <DonutChart 
        v-if="wastedProducts.length > 0"
        :data="chartData"
        :labels="chartLabels"
        :colors="['#E7E7E7', '#01877E', '#FFB0A9', '#F9D678', '#383838']">
      </DonutChart>
    </div>
    <navigation-menu />
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
import firebase from 'firebase';
import DonutChart from '@/components/DonutChart.vue'

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
    return this.wastedProducts.reduce<Category>((acc, product) => {
      const categoryName = product.category ?? 'General'
      if (!Object.keys(acc).includes(categoryName)) {
        acc[categoryName] = 0;
      }

      acc[categoryName]++;

      return acc;
    }, {});
  }

  get chartData() {
    return [ this.family?.totalProducts, ...Object.values(this.statistics)]
  }

  get chartLabels() {
    return [ 'Eaten', ...Object.keys(this.statistics)]
  }
}
</script>
