<template>
  <div>
    <v-header heading="Quit My Family" />
    <div class="mt-20">
      <v-alert
        v-if="alertMessage"
        :isPositive="isPositive"
        :label="alertMessage"
      />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <div v-if="!family">Loading...</div>
      <div v-else class="w-full">
        <div class="text-primary-text mb-3">Enter the family name to quit.</div>
        <v-input
          class="w-full"
          label="Enter the family name to quit"
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
import { Component, Vue } from "vue-property-decorator";
import { CurrentFamily } from "@/types";
import Family from "@/types/Family";
import VAlert from "@/components/VAlert.vue";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VHeader from "@/components/VHeader.vue";

@Component({
  components: {
    VAlert,
    VButton,
    VInput,
    VHeader
  }
})
export default class QuitFamily extends Vue {
  alertMessage = "";
  family: Family | null = null;
  familyNameInputValue = "";
  isPositive = false;

  async mounted() {
    this.family = await CurrentFamily.instance.getCurrentFamily();
  }

  async handleQuit() {
    await CurrentFamily.instance.quit();
    window.location.reload();
  }

  get familyNameInputMatch() {
    return this.familyNameInputValue === this.family?.name;
  }
}
</script>
