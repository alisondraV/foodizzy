<template>
  <div class="m-8">
    <div class="mb-4">
      <p class="text-4xl text-primary-text">Welcome!</p>
      <p class="text-sm">Let’s optimize your food consumption together</p>
    </div>
    <div class="mb-4">
      <v-input type="email" label="Type in your email" v-model="email" />
      <br />
      <v-input type="password" label="Type in your password" v-model="password" />
      <br />
      <v-button label="Sign In" @click="signIn" />
    </div>
    <button
      @click="$emit('click')"
      class="text-black shadow-xl rounded-md h-12 w-full mb-4"
    >
      Continue with Google
    </button>
    <div class="text-sm">
      <h3 class="text-sm mb-4">You don't have account yet? </h3>
      <h3 class="text-dark-peach cursor-pointer" @click="goToSignUpPage">Sign Up</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import router from "@/router";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";

@Component({
  components: {
    VInput,
    VButton
  }
})
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

  async signUpThroughGoogle() {
    await Authentication.signUpThroughGoogle();
    await router.push("/home");
  }
}
</script>
