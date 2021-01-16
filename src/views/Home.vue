<template>
  <div>
    <h1 class="text-6xl">Main</h1>
    <p v-for="wastedProduct in wastedProducts" :key="wastedProduct.name">
      {{ wastedProduct.name }}
    </p>
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

@Component({
  components: {
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
  }
  async getWastedForFamily() {
    this.wastedProducts = await Firestore.instance.getWastedForFamily(
      this.family
    );
  }
}
</script>
