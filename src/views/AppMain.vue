<template>
  <div>
    <h1>Main</h1>
    <Menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Menu from "@/components/Menu.vue";

@Component({
  components: {
    Menu
  }
})
export default class AppMain extends Vue {}
</script>
