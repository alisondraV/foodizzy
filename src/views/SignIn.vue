<template>
  <div class="m-8">
    <div class="mb-4">
      <p class="text-4xl text-primary-text">Welcome!</p>
      <p class="text-sm">Let’s optimize your food consumption together</p>
    </div>
    <div class="mb-8">
      <v-input type="email" label="Type in your email" v-model="email" />
      <br />
      <v-input type="password" label="Type in your password" v-model="password" />
      <br />
      <v-button class="mb-6" label="Sign In" @click="signIn" />
      <div class="flex items-center" style="color: grey">
        <hr class="w-1/2 border-gray mb-6"/>
        <span class="w-1/5 text-center mb-6">OR</span>
        <hr class="w-1/2 border-gray mb-6"/>
      </div>
      <button
        @click="$emit('click')"
        class="text-black rounded-md h-12 w-full"
        style="box-shadow: gray 1px 1px 10px"
      >
        Continue with Google
      </button>
    </div>
    <div class="text-center">
      <span class="text-sm mb-4 mr-5">Don't have account yet?</span>
      <span class="text-dark-peach cursor-pointer" @click="goToSignUpPage">Sign Up</span>
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
