<template>
  <div>
    <h1>Sign Up</h1>
    <form @submit.prevent>
      <label>
        Email:
        <input type="text" placeholder="Type in your email" v-model="email" />
      </label>
      <br />
      <label>
        Name:
        <input type="text" placeholder="Type in your name" v-model="name" />
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
      <button @click="signUp">Sign Up</button>
      <button @click="signUpThroughGoogle">Sign Up though Google</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
import Authentication from "@/utils/Authentication";

@Component
export default class SignUp extends Vue {
  email = "";
  name = "";
  password = "";

  async signUp() {
    await Authentication.signUp(this.email, this.password);
    await router.push("/app-main");
  }

  async signUpThroughGoogle() {
    await Authentication.signUpThroughGoogle();
  }
}
</script>
