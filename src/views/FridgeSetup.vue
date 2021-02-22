<template>
  <div>
    <div class="mt-24 mb-20 mx-8">
      <span
        class="ml-4 w-4/5 text-header place-self-center font-extrabold text-primary-text"
      >
        What is in your fridge?
      </span>
      <search-input class="mb-4" v-model="searchQuery" />
      <ul>
        <li
          class="mb-4"
          v-for="category in Object.keys(filteredCategoryProducts)"
          :key="category"
        >
          <h2 class="text-primary-green mb-1">{{ category }}</h2>
          <hr class="text-secondary-text mb-2" />
          <ul>
            <li
              class="flex justify-between py-3 text-xl left-0"
              v-for="product in filteredCategoryProducts[category]"
              :key="product.name"
            >
              <img
                src="@/assets/images/Check.svg"
                alt="Finished"
                @click="markAsFinished(product)"
              />
              <span class="flex-1 ml-4 text-primary-text">{{
                product.name
              }}</span>
              <img
                src="@/assets/images/Waste.svg"
                alt="Wasted"
                @click="markAsWasted(product)"
              />
            </li>
          </ul>
        </li>
      </ul>
      <div class="bottom-0 right-0 mb-20 mr-3 fixed">
        <img
          @click="addNewProduct"
          src="@/assets/images/AddNew.svg"
          alt="Add"
          class="cursor-pointer p-4"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Firestore from "@/utils/Firestore";
import Product from "@/types/Product";
import NavigationMenu from "@/components/NavigationMenu.vue";
import VHeader from "@/components/VHeader.vue";
import SearchInput from "@/components/SearchInput.vue";

@Component({
  components: {
    SearchInput,
    NavigationMenu,
    VHeader
  }
})
export default class Fridge extends Vue {
  products: Product[] = [];
  searchQuery = "";
  newProductName = "";
  newProductCategory = "";

  async mounted() {
    this.products = await this.getProductsWithCategory();
  }
}
</script>
