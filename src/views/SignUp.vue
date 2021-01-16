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
    <button @click="signUp">Sign Up</button>
  </form>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SignUp extends Vue {
  signUp() {
    console.log('signUp');
  }
}
</script>
