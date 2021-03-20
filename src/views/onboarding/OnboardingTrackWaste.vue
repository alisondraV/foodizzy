<template>
  <div>
    <skip-header @click="goToTheFridgeSetup" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/TrackWaste.svg" alt="Track Waste" class="mb-4" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Track Your Food Waste
      </h1>
      <p class="mb-6">
        How much of food waste do you produce every month? We will help you to reduce the amount of food
        waste. Let’s save this planet together!
      </p>
      <img src="@/assets/images/DotsFirst.svg" alt="Track Waste" class="mb-8" />
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
export default class OnboardingTrackWaste extends Vue {
  goToTheFridgeSetup() {
    router.safePush('/fridge-setup');
  }

  goToTheNextOnboarding() {
    router.safePush('/onboarding-shopping-lists');
  }
}
</script>
