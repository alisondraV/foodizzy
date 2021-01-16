<template>
  <form>
    <label>
      Email:
      <input type="text" placeholder="Type in your email">
    </label>
    <br />
    <label>
      Name:
      <input type="text" placeholder="Type in your name">
    </label>
    <br />
    <button @click="login">Sign In</button>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SignIn extends Vue {
  login() {
    console.log('login');
  }
}
</script>
