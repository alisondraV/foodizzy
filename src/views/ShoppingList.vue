<template>
  <div>
    <v-header heading="Shopping List" />
    <div class="mt-20 mb-20 mx-8">
      <h2 v-for="product in products" :key="product.name">
        {{ product.name }}
      </h2>
      <div class="bottom-0 right-0 mb-20 mr-3 fixed">
        <img
          @click="addNewProduct"
          src="@/assets/images/AddNew.svg"
          alt="Add"
          class="cursor-pointer p-4"
        />
      </div>
    </div>
    <navigation-menu current-page="ShoppingList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import NavigationMenu from "@/components/NavigationMenu.vue";
import Authentication from "@/utils/Authentication";
import Family from "@/types/Family";
import ShoppingListItem from "@/types/ShoppingListItem";
import VHeader from "@/components/VHeader.vue";
import router from "@/router";
import firebase from "firebase";

@Component({
  components: {
    NavigationMenu,
    VHeader
  }
})
export default class ShoppingList extends Vue {
  products: ShoppingListItem[] = [];
  user: firebase.User | null = null;
  family: Family | null = null;

  async mounted() {
    this.user = await Authentication.getCurrentUser();
    console.log(this.user!.uid);

    if (!this.user) {
      // TODO: handle unauthorized state
      throw new Error("Unauthrized!");
    }

    this.family = await Firestore.instance.getFamilyForUser(this.user!);
    this.products = this.family.shoppingList;
  }

  addNewProduct() {
    router.push({ path: 'new-product', query: { location: 'shoppingList' } });
  }
}
</script>
