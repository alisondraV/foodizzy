<template>
  <div>
    <skip-header @click="goToTheFridgeSetup" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/MakeLists.svg" alt="Shopping Lists" class="mb-10" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Make Shopping Lists
      </h1>
      <p class="mb-6">
        Are you struggling with your grocery shopping experience? Our app will help you to improve your
        shopping habits.
      </p>
      <img src="@/assets/images/DotsSecond.svg" alt="Shopping Lists" class="mb-8" />
      <v-button class="w-full" label="Next" @click="goToTheNextOnboarding" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { Component, Vue } from 'vue-property-decorator';
import SkipHeader from '@/components/SkipHeader.vue';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';

@Component({
  components: {
    SkipHeader,
    VButton,
    VInput
  }
})
export default class OnboardingMakeLists extends Vue {
  goToTheFridgeSetup() {
    router.safePush('/fridge-setup');
  }

  goToTheNextOnboarding() {
    router.safePush('/onboarding-invite-members');
  }
}
</script>
