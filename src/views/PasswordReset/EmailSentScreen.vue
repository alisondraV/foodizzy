<template>
  <div class="mt-6 mx-6 flex flex-col items-center text-primary-text">
    <img src="@/assets/images/ForgotPassword.svg" alt="Forgot Password" class="mb-2" />
    <h1 class="w-full text-left text-header-onboarding font-extrabold mb-3">Email Sent</h1>
    <p class="w-full text-left mb-2">We’ve sent you a password reset.</p>
    <div class="w-full text-left mb-2">
      <span>Have not received it? </span>
      <span class="text-primary-green" @click="sendPasswordReset">Resend</span>
    </div>
    <div class="text-dark-peach text-sm mb-12 h-4 text-left w-full">{{ errorMessage }}</div>
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

  async mounted() {
    this.email = this.$route.query.email as string;
  }

  goToSigIn() {
    router.safePush!(PathName.SignIn);
  }

  sendPasswordReset() {
    Authentication.instance.sendPasswordReset(this.email).catch(error => {
      console.log(`Send password reset error: ${error.code}`);
      this.displayError(error);
    });
  }
}
</script>
