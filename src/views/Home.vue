<template>
  <div>
    <v-header heading="" />
    <div class="mt-20 mb-20 mx-8">
      <p v-for="wastedProduct in wastedProducts" :key="wastedProduct.name">
        {{ wastedProduct.name }}
      </p>
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

@Component({
  components: {
    VHeader,
    NavigationMenu
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
    console.log(this.statistics);
    
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
}
</script>
