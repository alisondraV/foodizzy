<template>
  <div>
    <v-header heading="Change Password" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <v-input
          class="mb-6 w-full"
          type="password"
          label="Current Password"
          v-model="currentPassword"
        />
        <v-input
          class="mb-6 w-full"
          type="password"
          label="New Password"
          v-model="newPassword"
        />
        <div v-if="error">{{ error }}</div>
        <div class="bg-background h-24 w-full bottom-0 fixed">
          <v-button
            class="mx-8 mt-3"
            label="Change Password"
            @click="changePassword"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VHeader from "@/components/VHeader.vue";
import firebase from "firebase";

@Component({
  components: {
    VButton,
    VInput,
    VHeader
  }
})
export default class SignIn extends Vue {
  error = "";
  newPassword = "";
  currentPassword = "";
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.error = "Please provide you current password and the new one";
      return;
    }

    try {
      await Authentication.instance.changePassword(
        this.user!.email!,
        this.currentPassword,
        this.newPassword
      );
    } catch (e) {
      this.error = "We couldn't update your password";
    }
  }
}
</script>
