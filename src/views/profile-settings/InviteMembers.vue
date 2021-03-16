<template>
  <div class="m-8 flex flex-col h-screen">
    <p class="text-2xl font-bold text-primary-text mb-6">
      Invite Family Members
    </p>
    <div class="mb-8 flex-start">
      <div class="flex flex-row justify-between mb-4">
        <v-input
          class="w-4/5"
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
          class="flex justify-between color-red bg-red p-2 items-center py-3 text-lg"
        >
          <p>{{ email }}</p>
          <img
            src="@/assets/images/Close.svg"
            alt="remove"
            @click="removeEmail(email)"
            class="w-4 h-4"
          />
        </li>
      </ul>
    </div>
    <div>
      <v-button label="Invite Family Members" @click="inviteMembers" />
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { AlertMixin } from "@/components/AlertMixin";
import { Component } from "vue-property-decorator";
import { CurrentFamily } from "@/types/Family";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";

@Component({
  components: {
    VButton,
    VInput
  }
})
export default class InviteMembers extends AlertMixin {
  memberEmails: string[] = [];
  currentEmail = "";

  async inviteMembers() {
    await CurrentFamily.instance.inviteMembers(this.memberEmails);
    router.back();
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = "";
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
