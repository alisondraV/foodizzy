<template>
  <div>
    <v-header heading="Accept Your Invite" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">
        <!-- TODO: redirect to log-in and back -->
        <a href="/log-in">Log in</a> to accept your invite
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

@Component({
  components: { VHeader, VButton }
})
export default class AppMain extends Vue {
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  async handleAccept() {
    // TODO: move user from pendingMembers to members
    
    // TODO: redirect to /
  }
}
</script>
