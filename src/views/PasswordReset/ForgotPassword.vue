<template>
  <div class="mt-6 mx-6 flex flex-col items-center text-primary-text">
    <img src="@/assets/images/ForgotPassword.svg" alt="Forgot Password" class="mb-2" />
    <h1 class="w-full text-left text-header-onboarding font-extrabold mb-3">Forgot Password?</h1>
    <p class="mb-6">Enter your email below and we’ll get you back into your account.</p>
    <v-input
      class="w-full mb-1"
      label="Email Address"
      placeholder="Enter your email"
      type="email"
      v-model="email"
      :error="errorType === 'email'"
    />
    <div class="text-dark-peach mb-10 h-4 text-left w-full">{{ errorMessage }}</div>
    <v-button class="w-full" label="Submit" @click="sendPasswordReset" />
    <span class="absolute bottom-0 mb-8 text-primary-green" @click="goToSigIn">Back to Login</span>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { VButton, VInput } from '@/components';
import { ValidationMixin } from '@/mixins';
import { PathName } from '@/utils/enums';
import Authentication from '@/utils/Authentication';
import router from '@/router';

@Component({
  components: {
    VButton,
    VInput
  }
})
export default class OnboardingFamilyMembers extends Mixins(ValidationMixin) {
  email = '';

  goToSigIn() {
    router.safePush!(PathName.SignIn);
  }

  goToConfirmationPage() {
    router.safePush!(PathName.SignIn);
  }

  sendPasswordReset() {
    Authentication.instance
      .sendPasswordReset(this.email)
      .then(() => {
        return this.goToConfirmationPage();
      })
      .catch(error => {
        console.log(`Send password reset error: ${error.code}`);
        this.displayError(error);
      });
  }
}
</script>
