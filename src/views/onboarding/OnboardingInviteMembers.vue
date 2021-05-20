<template>
  <div>
    <skip-header @click="goToTheCreateFamily" />
    <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
      <img src="@/assets/images/InviteMembers.svg" alt="Invite Members" class="mb-10" />
      <h1 class="text-header-onboarding font-extrabold mb-3">
        Invite Family Members
      </h1>
      <p class="mb-10">
        Create family, invite your loved ones, track your food in the storage together and share the shopping
        list.
      </p>
      <v-button class="w-full mb-16" label="Next" @click="goToTheCreateFamily" />
      <img src="@/assets/images/DotsThird.svg" alt="InviteMembers" />
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
export default class OnboardingFamilyMembers extends Vue {
  goToTheCreateFamily() {
    router.safePush('/create-family');
  }
}
</script>
