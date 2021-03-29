<template>
  <div>
    <v-header heading="Quit My Family" />
    <div class="mb-20 mx-8 mt-24">
      <div v-if="!family">Loading...</div>
      <div v-else class="w-full">
        <div class="text-primary-text mb-3">Enter the family name to quit.</div>
        <v-input
          class="w-full"
          label="Family name"
          placeholder="Your family name"
          v-model="familyNameInputValue"
        />
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        class="mx-8 mt-3"
        label="Quit My Family"
        :disabled="!familyNameInputMatch"
        @click="handleQuit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CurrentFamily, Family } from '@/types';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import VHeader from '@/components/VHeader.vue';
import router from '@/router';

@Component({
  components: {
    VButton,
    VInput,
    VHeader
  }
})
export default class QuitFamily extends Vue {
  family: Family | null = null;
  familyNameInputValue = '';

  async mounted() {
    this.family = await CurrentFamily.instance.getCurrentFamily();
  }

  async handleQuit() {
    await CurrentFamily.instance.quit();
    router.back();
  }

  get familyNameInputMatch() {
    return this.familyNameInputValue === this.family?.name;
  }
}
</script>
