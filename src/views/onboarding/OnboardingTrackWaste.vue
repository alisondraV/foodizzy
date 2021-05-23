<template>
  <div>
    <skip-header @click="goToTheCreateFamily" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/TrackWaste.svg" alt="Track Waste" class="mb-4" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Track Your Food Waste
      </h1>
      <p class="mb-10">
        How much of food waste do you produce every month? We will help you to reduce the amount of food
        waste. Let’s save this planet together!
      </p>
      <v-button class="w-full mb-16" label="Next" @click="goToTheNextOnboarding" />
      <img src="@/assets/images/DotsFirst.svg" alt="Track Waste" />
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
export default class OnboardingTrackWaste extends Vue {
  goToTheCreateFamily() {
    router.safePush!('/create-family');
  }

  goToTheNextOnboarding() {
    router.safePush!('/onboarding/make-lists');
  }
}
</script>
