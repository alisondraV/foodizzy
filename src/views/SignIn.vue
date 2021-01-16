<template>
  <div>
    <h1>Sign In</h1>
    <form @submit.prevent>
      <label>
        Email:
        <input type="email" placeholder="Type in your email" v-model="email" />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          placeholder="Type in your password"
          v-model="password"
        />
      </label>
      <br />
      <button @click="signIn">Sign In</button>
    </form>
    <button @click="goToSignUpPage">Sign Up</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import router from "@/router";

@Component
export default class SignIn extends Vue {
  email = "";
  password = "";

  async signIn() {
    await Authentication.signIn(this.email, this.password);
    await router.push("/app-main");
  }

  goToSignUpPage() {
    router.push("/sign-up");
  }
}
</script>
