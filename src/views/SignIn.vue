<template>
  <div class="m-8">
    <div class="mb-4 flex">
      <div>
        <p class="text-4xl font-bold text-primary-text">Welcome!</p>
        <p class="text-sm text-secondary-text">
          Let’s optimize your food consumption together
        </p>
      </div>
      <img src="@/assets/images/LogoMain.svg" alt="Logo" class="p-4" />
    </div>
    <div class="mb-8">
      <v-input
        class="mb-6"
        type="email"
        label="Type in your email"
        v-model="email"
      />
      <v-input
        class="mb-6"
        type="password"
        label="Type in your password"
        v-model="password"
      />
      <div
        class="cursor-pointer underline text-right text-sm text-secondary-text"
        @click="resetPassword"
      >
        Forgot password?
      </div>
    </div>
    <div class="mb-8">
      <v-button class="mb-6" label="Sign In" @click="signIn" />
      <div class="flex items-center text-secondary-text">
        <hr class="w-1/2 border-gray mb-6" />
        <span class="w-1/5 text-center mb-6">OR</span>
        <hr class="w-1/2 border-gray mb-6" />
      </div>
      <button
        @click="signInThroughGoogle"
        class="text-black rounded-md h-12 w-full"
        style="box-shadow: gray 1px 1px 10px"
      >
        Continue with Google
      </button>
    </div>
    <div class="text-center">
      <span class="text-sm mb-4 mr-5">Don't have account yet?</span>
      <span class="text-dark-peach cursor-pointer" @click="goToSignUpPage"
        >Sign Up</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import router from "@/router";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import { CurrentFamily } from "@/types";

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignIn extends Vue {
  email = "";
  password = "";

  goToSignUpPage() {
    router.push("/sign-up");
  }

  resetPassword() {
    console.log("Reset Password");
  }

  async signIn() {
    await Authentication.instance.signIn(this.email, this.password);
    try {
      await CurrentFamily.instance.getCurrentFamily();
      await router.push("/home");
    } catch (err) {
      await router.push("/create-family");
    }
  }

  async signInThroughGoogle() {
    await Authentication.instance.authWithGoogle();
    try {
      await CurrentFamily.instance.getCurrentFamily();
      await router.push("/home");
    } catch (err) {
      await router.push("/create-family");
    }
  }
}
</script>
