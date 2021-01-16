<template>
  <div>
    <h1>Main</h1>
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
export default class Home extends Vue {}
</script>
