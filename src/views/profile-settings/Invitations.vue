<template>
  <div>
    <v-header heading="My Invitations" />
    <div class="mt-20">
      <v-alert
        v-if="alertMessage"
        :isPositive="isPositive"
        :label="alertMessage"
      />
    </div>
    <div class="mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <div v-if="!user">
        <!-- TODO: redirect to log-in and back -->
        <a href="/sign-in?redirect=invitations" class="underline">Log in</a> to
        accept your invite.
      </div>
      <div v-else-if="invitations.length === 0" class="text-dark-peach -mt-2">
        No pending invitations.
      </div>
      <div v-else>
        <div v-for="family in invitations" :key="family.id">
          <div class="flex w-full justify-between mb-3">
            <div class="flex-1 text-primary-text">
              {{ family.name }}
            </div>
            <div
              class="text-primary-green mr-4"
              @click="handleAcceptInvite(family.id)"
            >
              Accept
            </div>
            <div
              class="text-dark-peach"
              @click="handleDeclineInvitation(family.id)"
            >
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
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";
import Authentication from "@/utils/Authentication";
import VAlert from "@/components/VAlert.vue";
import VHeader from "@/components/VHeader.vue";
import VButton from "@/components/VButton.vue";
import Family, { CurrentFamily } from "@/types/Family";
import Firestore from "@/utils/Firestore";

@Component({
  components: { VAlert, VHeader, VButton }
})
export default class AppMain extends Vue {
  alertMessage = "";
  isPositive = false;
  invitations: Family[] = [];
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    this.invitations = await Firestore.instance.getInvitations(
      this.user?.email ?? ""
    );
  }

  async handleAcceptInvite(familyId: string) {
    if (!this.user || !this.user.email) throw new Error("Unauthorized!");

    try {
      await CurrentFamily.instance.switchTo(familyId, this.user.email);
      this.isPositive = true;
      this.alertMessage = "You've accepted the invitation";
    } catch (e) {
      this.alertMessage = "Couldn't accept the invitation";
    }
  }

  async handleDeclineInvitation(familyId: string) {
    if (!this.user || !this.user.email) throw new Error("Unauthorized!");

    try {
      await Firestore.instance.declineInvitation(familyId, this.user.email);
      this.isPositive = false;
      this.alertMessage = "The invitation has been declined";
    } catch (e) {
      this.alertMessage = "Couldn't decline the invitation";
    }
  }
}
</script>
