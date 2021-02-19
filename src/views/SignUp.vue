<template>
  <div class="m-8">
    <div class="mb-4 flex">
      <div>
        <p class="text-2xl font-extrabold text-primary-text mb-3">
          Create Account!
        </p>
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
        type="name"
        label="Type in your name"
        v-model="name"
      />
      <v-input
        class="mb-6"
        type="password"
        label="Type in your password"
        v-model="password"
      />
    </div>
    <div class="mb-8">
      <v-button class="mb-6" label="Sign Up" @click="signUp" />
      <div class="flex items-center text-secondary-text">
        <hr class="w-1/2 border-gray mb-6" />
        <span class="w-1/5 text-center mb-6">OR</span>
        <hr class="w-1/2 border-gray mb-6" />
      </div>
      <button
        @click="signUpThroughGoogle"
        class="text-black rounded-md h-12 w-full"
        style="box-shadow: gray 1px 1px 10px"
      >
        Sign Up with Google
      </button>
    </div>
    <div class="text-center">
      <span class="text-sm mb-4 mr-5">Already have an account?</span>
      <span class="text-dark-peach cursor-pointer" @click="goToSignInPage"
        >Sign In</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import router from "@/router";
import Authentication from "@/utils/Authentication";
import VInput from "@/components/VInput.vue";
import VButton from "@/components/VButton.vue";
import Firestore from "@/utils/Firestore";

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignUp extends Vue {
  email = "";
  name = "";
  password = "";

  goToSignInPage() {
    router.push("/sign-in");
  }

  async signUp() {
    await Authentication.instance.signUp(this.email, this.password, this.name);
    try {
      await Firestore.instance.getCurrentFamily();
      await router.push("/");
    } catch (err) {
      await router.push("/create-family");
    }
  }

  async signUpThroughGoogle() {
    await Authentication.instance.authWithGoogle();
    try {
      await Firestore.instance.getCurrentFamily();
      await router.push("/");
    } catch (err) {
      await router.push("/create-family");
    }
  }
}
</script>
