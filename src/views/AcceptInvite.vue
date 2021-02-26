<template>
  <div>
    <v-header heading="Accept Your Invite" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">
        <!-- TODO: redirect to log-in and back -->
        <a href="/log-in" class="underline">Log in</a> to accept your invite.
      </div>
      <div v-else-if="invites.length === 0">
        You don't have any pending invites.
      </div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <button @click="handleAccept">Accept</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";
import Authentication from "@/utils/Authentication";
import VHeader from "@/components/VHeader.vue";
import VButton from "@/components/VButton.vue";
import Family, { CurrentFamily } from "@/types/Family";
import Firestore from "@/utils/Firestore";

@Component({
  components: { VHeader, VButton }
})
export default class AppMain extends Vue {
  user: firebase.User | null = null;
  invites: Family[] = [];

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    this.invites = await Firestore.instance.getInvites(this.user?.email ?? '');
  }

  async handleAccept() {
    // TODO: move user from pendingMembers to members
    
    // TODO: redirect to /
  }
}
</script>
