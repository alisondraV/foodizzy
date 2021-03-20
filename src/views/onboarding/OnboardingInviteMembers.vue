<template>
  <div>
    <skip-header @click="goToTheCreateFamily" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/InviteMembers.svg" alt="Invite Members" class="mb-10" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Invite Family Members
      </h1>
      <p class="mb-8">
        Create family, invite your loved ones, track your food in the fridge together and share the shopping
        list.
      </p>
      <img src="@/assets/images/DotsThird.svg" alt="InviteMembers" class="mb-10" />
      <v-button class="w-full" label="Next" @click="goToTheCreateFamily" />
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
export default class OnboardingFamilyMembers extends Vue {
  goToTheCreateFamily() {
    router.safePush('/create-family');
  }
}
</script>
