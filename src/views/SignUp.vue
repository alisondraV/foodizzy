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
        :error="errorType === 'email'"
      />
      <v-input
        class="mb-6"
        type="name"
        label="Type in your name"
        v-model="name"
        :error="errorType === 'displayName'"
      />
      <v-input
        class="mb-6"
        type="password"
        label="Type in your password"
        v-model="password"
        :error="errorType === 'password'"
      />
    </div>
    <div class="text-dark-peach">{{ errorMessage }}</div>
    <div class="mb-8">
      <v-button
        class="mb-6"
        label="Sign Up"
        :disabled="validationFailed"
        @click="signUp"
      />
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
import { Component, Vue } from 'vue-property-decorator';
import router from '@/router';
import Authentication from '@/utils/Authentication';
import VInput from '@/components/VInput.vue';
import VButton from '@/components/VButton.vue';
import { CurrentFamily } from '@/types';
import { authErrors } from '@/utils/consts';

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignUp extends Vue {
  email = '';
  name = '';
  password = '';
  errorMessage = '';
  errorType = '';

  get redirect(): string | null {
    return (this.$route.query.redirect as string) ?? null;
  }

  goToSignInPage() {
    let route = '/sign-in';
    if (this.redirect) {
      route += '?redirect=' + this.redirect;
    }
    router.replace(route);
  }

  get validationFailed(): boolean {
    if (this.name === '') {
      this.errorMessage = 'Please provide a name';
      this.errorType = 'displayName';
      return true;
    }

    const passwordValidation = {
      hasNumber: /\d/,
      hasUpperCase: /[A-Z]/,
      hasLowerCase: /[a-z]/,
      hasSpecial: /[!"#$%&'()*+,-.]/,
      isLong: /^.{8,}$/
    };

    const passwordCorrect = Object.values(passwordValidation).every(pattern =>
      Boolean(this.password.match(pattern))
    );
    if (!passwordCorrect) {
      this.errorMessage = 'Password is weak';
      this.errorType = 'password';
      return true;
    }

    this.errorMessage = '';
    this.errorType = '';
    return false;
  }

  signUp() {
    Authentication.instance
      .signUp(this.email, this.password, this.name)
      .then(() => {
        return this.tryGetFamilyAndForward();
      })
      .catch(error => {
        console.log(`Auth error: ${error.code}`);

        this.errorMessage = authErrors[error.code]?.message ?? error.message;
        this.errorType = authErrors[error.code]?.type ?? '';
      });
  }

  async signUpThroughGoogle() {
    await Authentication.instance.authWithGoogle();
    await this.tryGetFamilyAndForward();
  }

  async tryGetFamilyAndForward() {
    try {
      await CurrentFamily.instance.getCurrentFamily();
      await this.finishSignUp();
    } catch (err) {
      await this.finishSignUp('create-family');
    }
  }

  async finishSignUp(targetRoute = '') {
    const route = '/' + (this.redirect ?? targetRoute);
    await router.replace(route);
  }
}
</script>
