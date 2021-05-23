<template>
  <div>
    <skip-header @click="goToTheCreateFamily" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/MakeLists.svg" alt="Shopping Lists" class="mb-10" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Make Shopping Lists
      </h1>
      <p class="mb-10">
        Are you struggling with your grocery shopping experience? Our app will help you to improve your
        shopping habits.
      </p>
      <v-button class="w-full mb-16" label="Next" @click="goToTheNextOnboarding" />
      <img src="@/assets/images/DotsSecond.svg" alt="Shopping Lists" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SkipHeader, VButton, VInput } from '@/components';
import router from '@/router';

@Component({
  components: {
    SkipHeader,
    VButton,
    VInput
  }
})
export default class OnboardingMakeLists extends Vue {
  goToTheCreateFamily() {
    router.safePush!('/create-family');
  }

  goToTheNextOnboarding() {
    router.safePush!('/onboarding/invite-members');
  }
}
</script>
