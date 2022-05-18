<template>
  <div>
    <v-header heading="Invite Family Members" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <div class="flex flex-row justify-between mb-4">
        <v-input
          class="w-5/6"
          type="email"
          label="Email Address"
          placeholder="Enter member’s email"
          v-model="currentEmail"
          :error="errorType === 'email'"
        />
        <img
          alt="Add"
          class="mt-6"
          src="@/assets/images/PlusIcon.svg"
          v-if="isEmailInValidState"
          @click="addEmail"
        />
      </div>
      <ul>
        <li
          v-for="email in memberEmails"
          :key="email"
          class="flex justify-between items-center text-primary-text
                  bg-light-yellow py-2 px-4 rounded text-sm mb-2"
        >
          <p>{{ email }}</p>
          <img src="@/assets/images/Cross.svg" alt="remove" @click="removeEmail(email)" class="w-4 h-4" />
        </li>
      </ul>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <div class="text-dark-peach mx-8">{{ errorMessage }}</div>
      <v-button
        class="mx-8 mt-3"
        label="Invite Family Members"
        :disabled="memberEmails.length === 0"
        @click="inviteMembers"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AlertStatus, PathName } from '@/utils/enums';
import { VAlert, VButton, VHeader, VInput } from '@/components';
import { AlertMixin, ValidationMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator';
import { CurrentFamily } from '@/types/Family';
import router from '@/router';

@Component({
  components: {
    VAlert,
    VButton,
    VHeader,
    VInput
  }
})
export default class InviteMembers extends Mixins(AlertMixin, ValidationMixin) {
  currentEmail = '';
  memberEmails: string[] = [];

  async inviteMembers() {
    try {
      await CurrentFamily.instance.inviteMembers(this.memberEmails);
      this.memberEmails = [];
      await this.showAlert('Invites have been sent', AlertStatus.Success);
      await router.safePush!(PathName.Family);
    } catch (e) {
      await this.showAlert("Couldn't send the invites", AlertStatus.Danger);
    }
  }

  get isEmailInValidState() {
    this.errorMessage = '';
    this.errorType = '';

    return this.currentEmail !== '' && this.isEmailValid(this.currentEmail);
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = '';
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
