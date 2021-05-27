<template>
  <div>
    <v-header heading="My Invitations" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <div v-if="!user">
        <a href="/sign-in?redirect=invitations" class="underline">Log in</a> to accept your invite.
      </div>
      <div v-else-if="invitations.length === 0" class="text-dark-peach">
        No pending invitations.
      </div>
      <div v-else>
        <div v-for="family in invitations" :key="family.id">
          <div class="flex w-full justify-between mb-3">
            <div class="flex-1 text-primary-text">
              {{ family.name }}
            </div>
            <div class="text-primary-green mr-4" @click="handleAcceptInvite(family.id)">
              Accept
            </div>
            <div class="text-dark-peach" @click="handleDeclineInvitation(family.id)">
              Decline
            </div>
          </div>
          <hr class="w-full border-secondary-text mb-6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CurrentFamily, Family } from '@/types';
import { VAlert, VButton, VHeader } from '@/components';
import { AlertMixin } from '@/mixins';
import { AlertStatus } from '@/utils/enums';
import Authentication from '@/utils/Authentication';
import { AuthorizationError } from '@/utils/errors';
import { Component } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import firebase from 'firebase';

@Component({
  components: { VAlert, VHeader, VButton }
})
export default class AppMain extends AlertMixin {
  invitations: Family[] = [];
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    await this.getInvitations();

    await CurrentFamily.instance.listenForChanges();
  }

  private async getInvitations() {
    this.invitations = await Firestore.instance.getInvitations(this.user?.email ?? '');
  }

  async handleAcceptInvite(familyId: string) {
    if (!this.user || !this.user.email) throw new AuthorizationError();

    try {
      await CurrentFamily.instance.switchTo(familyId, this.user.email);
      await this.getInvitations();
      await this.showAlert("You've accepted the invitation", AlertStatus.Success);
    } catch (e) {
      await this.showAlert("Couldn't accept the invitation", AlertStatus.Danger);
    }
  }

  async handleDeclineInvitation(familyId: string) {
    if (!this.user || !this.user.email) throw new AuthorizationError();

    try {
      await Firestore.instance.declineInvitation(familyId, this.user.email);
      await this.getInvitations();
      await this.showAlert('The invitation has been declined');
    } catch (e) {
      await this.showAlert("Couldn't decline the invitation", AlertStatus.Danger);
    }
  }
}
</script>
