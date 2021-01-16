<template>
  <div class="home">
    <button @click="goToLoginPage">Sign In</button>
    <button @click="goToSignUpPage">Sign Up</button>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import router from "@/router";

export default class Home extends Vue {
  goToLoginPage() {
    router.push("/sign-in");
  }
  goToSignUpPage() {
    router.push("/sign-up");
  }
}
</script>
