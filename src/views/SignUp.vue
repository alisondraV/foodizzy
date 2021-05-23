<template>
  <div class="m-8">
    <div class="mb-8 flex">
      <div>
        <p class="text-2xl font-extrabold text-primary-text mb-3">
          Create Account!
        </p>
        <p class="text-sm text-secondary-text">
          Let’s optimize your food consumption together
        </p>
      </div>
      <img src="@/assets/images/Leaves.svg" alt="Logo" />
    </div>
    <div class="mb-4">
      <v-input
        class="mb-3"
        data-cy="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        v-model="email"
        :error="errorType === 'email'"
      />
      <v-input
        class="mb-3"
        data-cy="name"
        type="text"
        label="Name"
        placeholder="Enter your name"
        v-model="name"
        :error="errorType === 'displayName'"
      />
      <v-input
        class="mb-3"
        data-cy="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        v-model="password"
        :error="errorType === 'password'"
      />
      <div class="grid grid-cols-2 ml-1">
        <div :class="passwordValidation.hasLowerCase ? 'text-primary-green' : 'text-dark-peach'">
          1 lowercase
        </div>
        <div :class="passwordValidation.hasNumber ? 'text-primary-green' : 'text-dark-peach'">
          1 number
        </div>
        <div :class="passwordValidation.isLong ? 'text-primary-green' : 'text-dark-peach'">
          8 characters
        </div>
      </div>
    </div>
    <div class="text-dark-peach mb-2 ml-1">{{ errorMessage }}</div>
    <div class="mb-8">
      <v-button class="mb-4" data-cy="sign-up" label="Sign Up" :disabled="validationFailed" @click="signUp" />
      <div class="flex items-center text-secondary-text">
        <hr class="w-1/2 border-gray mb-4" />
        <span class="w-1/5 text-center mb-4">OR</span>
        <hr class="w-1/2 border-gray mb-4" />
      </div>
      <button
        @click="signUpThroughGoogle"
        class="text-black rounded-lg h-12 w-full"
        style="box-shadow: #DFDFDF 1px 2px 12px"
      >
        Sign Up with Google
      </button>
    </div>
    <div class="text-center">
      <span class="text-sm mb-4 mr-5">Already have an account?</span>
      <span class="text-dark-peach cursor-pointer" @click="goToSignInPage">Sign In</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { VButton, VInput } from '@/components';
import Authentication from '@/utils/Authentication';
import { CurrentFamily } from '@/types';
import { ValidationMixin } from '@/mixins';
import router from '@/router';

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignUp extends Mixins(ValidationMixin) {
  email = '';
  name = '';
  password = '';

  get redirect(): string | null {
    return (this.$route.query.redirect as string) ?? null;
  }

  goToSignInPage() {
    if (!this.redirect) {
      return router.safeReplace!('/sign-in');
    }
    return router.safeReplace!({
      path: '/sign-in',
      query: {
        redirect: this.redirect
      }
    });
  }

  get isFormInValidState() {
    return this.isEmailValid(this.email) && this.isDisplayNameValid(this.name) && this.isPasswordValid();
  }

  signUp() {
    Authentication.instance
      .signUp(this.email, this.password, this.name)
      .then(() => {
        return this.tryGetFamilyAndForward();
      })
      .catch(error => {
        console.log(`Auth error: ${error.code}`);
        this.displayError(error);
      });
  }

  async signUpThroughGoogle() {
    await Authentication.instance.authWithGoogle();
    await this.tryGetFamilyAndForward();
  }

  async tryGetFamilyAndForward() {
    try {
      await CurrentFamily.instance.getCurrentFamily();
    } catch (e) {
      console.log('Could not get family: ', e.message);
    }
    await router.safePush!('/onboarding/track-waste');
  }
}
</script>
