<template>
  <div>
    <h1>Your Profile</h1>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";

@Component
export default class AppMain extends Vue {
  goBack() {
    router.back();
  }
}
</script>