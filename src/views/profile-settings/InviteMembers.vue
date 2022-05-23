<template>
  <div>
    <v-header heading="Invite Family Members" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <emails-list :member-emails="memberEmails" />
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
import { AlertStatus, PathName } from '@/utils/enums';
import { VAlert, VButton, VHeader } from '@/components';
import EmailsList from '@/components/EmailsList.vue';
import { AlertMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator';
import { CurrentFamily } from '@/types/Family';
import router from '@/router';

@Component({
  components: {
    EmailsList,
    VAlert,
    VButton,
    VHeader
  }
})
export default class InviteMembers extends Mixins(AlertMixin) {
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
}
</script>
