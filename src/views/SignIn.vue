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
        class="mb-2"
        data-cy="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        v-model="password"
        :error="errorType === 'password'"
      />
      <div class="text-dark-peach mb-2 text-sm">{{ errorMessage }}</div>
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

<script setup lang="ts">
import { VButton, VInput } from '@/components';
import Authentication from '@/utils/Authentication';
import { CurrentFamily } from '@/types';
import { PathName } from '@/utils/enums';
import { useValidation } from '@/composables/useValidation';
import router from '@/router';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

const route = useRoute();
const { displayError, errorType, errorMessage } = useValidation();

const email = ref('');
const password = ref('');

const redirect = computed<string | null>(() => {
  return (route.query.redirect as string) ?? null;
});

async function finishSignIn(targetRoute: PathName) {
  if (!redirect) {
    return router.safeReplace!(targetRoute);
  }
  return router.safeReplace!({
    path: targetRoute,
    query: {
      redirect: redirect.value
    }
  });
}

function goToSignUpPage() {
  finishSignIn(PathName.SignUp);
}

async function resetPassword() {
  await router.safePush!(PathName.ForgotPassword);
}

async function tryGetFamilyAndForward() {
  try {
    await CurrentFamily.instance.getCurrentFamily();
    await finishSignIn(PathName.Storage);
  } catch (err) {
    await finishSignIn(PathName.OnboardingTrackWaste);
  }
}

async function signIn() {
  Authentication.instance
    .signIn(email.value, password.value)
    .then(() => {
      return tryGetFamilyAndForward();
    })
    .catch(error => {
      console.log(`Auth error: ${error.code}`);
      displayError(error);
    });
}

async function signInThroughGoogle() {
  await Authentication.instance.authWithGoogle();
  await tryGetFamilyAndForward();
}
</script>
