<template>
  <div>
    <v-header heading="Invite Family Members" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :isPositive="isPositive" :label="alertMessage" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <div class="flex flex-row justify-between mb-4">
        <v-input
          class="w-4/5"
          type="email"
          label="Email Address"
          placeholder="Enter member’s email"
          v-model="currentEmail"
        />
        <img src="@/assets/images/Plus.svg" alt="Add" class="mt-6" @click="addEmail" />
      </div>
      <ul>
        <li
          v-for="email in memberEmails"
          :key="email"
          class="flex justify-between items-center text-primary-text
                  bg-light-yellow py-2 px-4 rounded text-sm mb-2"
        >
          <p>{{ email }}</p>
          <img src="@/assets/images/Remove.svg" alt="remove" @click="removeEmail(email)" class="w-4 h-4" />
        </li>
      </ul>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
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
import { AlertMixin } from '@/mixins/AlertMixin';
import { Component } from 'vue-property-decorator';
import { CurrentFamily } from '@/types/Family';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import VHeader from '@/components/VHeader.vue';
import router from '@/router';

@Component({
  components: {
    VAlert,
    VButton,
    VInput,
    VHeader
  }
})
export default class InviteMembers extends AlertMixin {
  currentEmail = '';
  isPositive = false;
  memberEmails: string[] = [];

  async inviteMembers() {
    try {
      await CurrentFamily.instance.inviteMembers(this.memberEmails);
      this.memberEmails = [];
      this.isPositive = true;
      await this.showAlert('Invites have been sent');
      router.safePush('/family');
    } catch (e) {
      this.isPositive = false;
      await this.showAlert("Couldn't send the invites");
    }
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
