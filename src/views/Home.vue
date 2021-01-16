<template>
  <div>
    <h1 class="text-6xl">Main</h1>
    <div class="bottom-0 right-0 mb-20 mr-3 fixed">
      <img
        @click="addNewProduct"
        src="@/assets/images/AddNew.svg"
        alt="Add"
        class="cursor-pointer p-4"
      />
    </div>
    <navigation-menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";

@Component({
  components: {
    NavigationMenu
  }
})
export default class Home extends Vue {
  addNewProduct() {
    console.log("Add new");
  }
}
</script>
