<template>
  <div>
    <div class="mt-8 mx-8 flex flex-col h-screen">
      <p class="text-2xl font-bold text-primary-text mb-6">
        Create Your Family
      </p>
      <div class="flex-start">
        <v-input
          class="mb-2"
          data-cy="name"
          type="text"
          label="Family Name"
          placeholder="Enter your family name"
          v-model="familyName"
        />
        <div class="text-dark-peach mb-6 text-sm">{{ errorMessage }}</div>
        <p class="text-1xl font-bold text-primary-text mb-4">
          Invite Family Members
        </p>
        <emails-list :member-emails="memberEmails" />
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        class="mx-8"
        data-cy="create"
        label="Create Family"
        :disabled="validationFailed"
        @click="createFamily"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VButton, VInput } from '@/components';
import { CurrentFamily } from '@/types';
import { PathName } from '@/utils/enums';
import router from '@/router';
import EmailsList from '@/components/EmailsList.vue';
import { useValidation } from '@/composables/useValidation';
import { ref, watch } from 'vue';

const familyName = ref('');
const memberEmails = ref<string[]>([]);

const { errorMessage, isDisplayNameValid, validationFailed } = useValidation();

watch(familyName, () => {
  isDisplayNameValid(familyName.value);
});

function goToTheNextPage() {
  router.safePush!(PathName.StorageSetup);
}

async function createFamily() {
  await CurrentFamily.instance.create(familyName.value, memberEmails.value);
  goToTheNextPage();
}
</script>
