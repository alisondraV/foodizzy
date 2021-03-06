<template>
  <div>
    <div class="mt-8 mb-20 mx-8 flex flex-col h-screen">
      <p class="text-2xl font-bold text-primary-text mb-6">
        Create Your Family
      </p>
      <div class="mb-8 flex-start">
        <v-input
          class="mb-2"
          data-cy="name"
          type="text"
          label="Family Name"
          placeholder="Enter your family name"
          v-model="familyName"
        />
        <div class="text-dark-peach mb-6">{{ errorMessage }}</div>
        <p class="text-1xl font-bold text-primary-text mb-4">
          Invite Family Members
        </p>
        <div class="flex flex-row justify-between mb-4">
          <v-input
            class="w-5/6"
            data-cy="member-email"
            type="email"
            label="Email Address"
            placeholder="Enter member's email"
            v-model="currentEmail"
          />
          <img
            alt="Add"
            class="mt-6"
            data-cy="add-member"
            src="@/assets/images/PlusIcon.svg"
            @click="addEmail"
          />
        </div>
        <ul>
          <li
            v-for="email in memberEmails"
            :key="email"
            class="flex justify-between items-center bg-light-yellow py-2 px-4 rounded text-sm mb-2"
          >
            <p>{{ email }}</p>
            <img
              alt="remove"
              class="w-4 h-4 text-primary-text"
              src="@/assets/images/Cross.svg"
              @click="removeEmail(email)"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        class="mx-8 mt-3"
        data-cy="create"
        label="Create Family"
        :disabled="validationFailed"
        @click="createFamily"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { VButton, VInput } from '@/components';
import { CurrentFamily } from '@/types';
import { PathName } from '@/utils/enums';
import { ValidationMixin } from '@/mixins';
import router from '@/router';

@Component({
  components: {
    VButton,
    VInput
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

  get isFormInValidState() {
    return (
      (this.currentEmail === '' || this.isEmailValid(this.currentEmail)) &&
      this.isDisplayNameValid(this.familyName)
    );
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = '';
  }

  goToTheNextPage() {
    router.safePush!(PathName.StorageSetup);
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
