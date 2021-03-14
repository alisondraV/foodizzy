<template>
  <div>
    <skip-header @click="goToTheNextPage" />
    <div class="mt-20 mb-20 mx-8 flex flex-col h-screen">
      <p class="text-2xl font-bold text-primary-text mb-6">
        Create Your Family
      </p>
      <div class="mb-8 flex-start">
        <v-input
          class="mb-6"
          type="text"
          label="Family Name"
          v-model="familyName"
        />
        <div class="text-dark-peach">{{ errorMessage }}</div>
        <p class="text-1xl font-bold text-primary-text mb-4">
          Invite Family Members
        </p>
        <div class="flex flex-row justify-between mb-4">
          <v-input
            class="w-5/6"
            type="email"
            label="Email Address"
            v-model="currentEmail"
          />
          <img src="@/assets/images/Plus.svg" alt="Add" @click="addEmail" />
        </div>
        <ul>
          <li
            v-for="email in memberEmails"
            :key="email"
            class="flex justify-between items-center bg-light-peach py-2 px-4 rounded text-sm mb-2"
          >
            <p>{{ email }}</p>
            <img
              alt="remove"
              class="w-4 h-4 text-primary-text"
              src="@/assets/images/Remove.svg"
              @click="removeEmail(email)"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        class="mx-8 mt-3"
        label="Create Family"
        :disabled="validationFailed"
        @click="createFamily"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SkipHeader from '@/components/SkipHeader.vue';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import { ValidationMixin } from '@/mixins';
import router from '@/router';
import { CurrentFamily } from '@/types';
import { Component, Mixins } from 'vue-property-decorator';

@Component({
  components: {
    SkipHeader,
    VInput,
    VButton
  }
})
export default class CreateFamily extends Mixins(ValidationMixin) {
  familyName = '';
  memberEmails: string[] = [];
  currentEmail = '';

  async createFamily() {
    await CurrentFamily.instance.create(this.familyName, this.memberEmails);
    this.goToTheNextPage();
  }

  get validationFailed(): boolean {
    if (
      (this.currentEmail === '' || this.isEmailValid(this.currentEmail)) &&
      this.isDisplayNameValid(this.familyName)
    ) {
      this.errorMessage = '';
      this.errorType = '';
      return false;
    }
    return true;
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = '';
  }

  goToTheNextPage() {
    router.push('/fridge-setup');
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
