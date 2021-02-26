<template>
  <div>
    <v-header heading="Accept Your Invite" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">
        <!-- TODO: redirect to log-in and back -->
        <a href="/sign-in?redirect=invites" class="underline">Log in</a> to accept your invite.
      </div>
      <div v-else-if="invites.length === 0">
        You don't have any pending invites.
      </div>
      <div v-else class="w-full grid gap-2 justify-items-center">
        <div v-for="family in invites" :key="family.id" class="w-3/4 grid grid-cols-5 gap-3">
          <div class="text-lg align-text-bottom col-span-3">{{ family.name }}</div>
          <v-button class="button col-span-2" @click="handleAcceptInvite(family.id)" label="Accept"></v-button>
        </div>
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
import router from "@/router";

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

  async handleAcceptInvite(familyId: string) {
    if (!this.user || !this.user.email) throw new Error('Unauthorized!');

    await CurrentFamily.instance.switchTo(familyId, this.user.email);
    
    await router.push('/');
  }
}
</script>
