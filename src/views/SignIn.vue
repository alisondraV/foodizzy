<template>
  <div class="m-8">
    <div class="mb-4 flex">
      <div>
        <p class="text-4xl font-bold text-primary-text">Welcome!</p>
        <p class="text-sm text-secondary-text">
          Let’s optimize your food consumption together
        </p>
      </div>
      <img src="@/assets/images/Leaves.svg" alt="Logo" class="p-4" />
    </div>
    <div class="mb-8">
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
        data-cy="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        v-model="password"
        :error="errorType === 'password'"
      />
      <div class="text-dark-peach">{{ errorMessage }}</div>
      <div class="cursor-pointer underline text-right text-sm text-secondary-text" @click="resetPassword">
        Forgot password?
      </div>
    </div>
    <div class="mb-8">
      <v-button class="mb-4" data-cy="sign-in" label="Sign In" @click="signIn" />
      <div class="flex items-center text-secondary-text">
        <hr class="w-1/2 border-gray mb-4" />
        <span class="w-1/5 text-center mb-4">OR</span>
        <hr class="w-1/2 border-gray mb-4" />
      </div>
      <button
        @click="signInThroughGoogle"
        class="text-black rounded-md h-12 w-full"
        data-cy="google-sign-in"
        style="box-shadow: #DFDFDF 1px 2px 12px"
      >
        Continue with Google
      </button>
    </div>
    <div class="text-center">
      <span class="text-sm mb-4 mr-5">Don't have an account yet?</span>
      <span class="text-dark-peach cursor-pointer" @click="goToSignUpPage">Sign Up</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { VButton, VInput } from '@/components';
import Authentication from '@/utils/Authentication';
import { CurrentFamily } from '@/types';
import { PathName } from '@/utils/enums';
import { ValidationMixin } from '@/mixins';
import router from '@/router';

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignIn extends Mixins(ValidationMixin) {
  email = '';
  password = '';

  get redirect(): string | null {
    return (this.$route.query.redirect as string) ?? null;
  }

  goToSignUpPage() {
    this.finishSignIn(PathName.SignUp);
  }

  async resetPassword() {
    // TODO: add validation
    await Authentication.instance.sendPasswordReset(this.email);
  }

  async signIn() {
    Authentication.instance
      .signIn(this.email, this.password)
      .then(() => {
        return this.tryGetFamilyAndForward();
      })
      .catch(error => {
        console.log(`Auth error: ${error.code}`);
        this.displayError(error);
      });
  }

  async signInThroughGoogle() {
    await Authentication.instance.authWithGoogle();
    await this.tryGetFamilyAndForward();
  }

  async tryGetFamilyAndForward() {
    try {
      await CurrentFamily.instance.getCurrentFamily();
      await this.finishSignIn(PathName.Storage);
    } catch (err) {
      await this.finishSignIn(PathName.OnboardingTrackWaste);
    }
  }

  async finishSignIn(targetRoute: PathName) {
    if (!this.redirect) {
      return router.safeReplace!(targetRoute);
    }
    return router.safeReplace!({
      path: targetRoute,
      query: {
        redirect: this.redirect
      }
    });
  }
}
</script>
