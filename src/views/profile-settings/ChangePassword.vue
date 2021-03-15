<template>
  <div>
    <v-header heading="Change Password" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :isPositive="isPositive" :label="alertMessage" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-24'">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <v-input
          class="mb-6 w-full"
          type="password"
          label="Current Password"
          v-model="currentPassword"
          @focus="clearTheMessage"
        />
        <v-input
          class="mb-6 w-full"
          type="password"
          label="New Password"
          v-model="newPassword"
          @focus="clearTheMessage"
        />
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
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import VAlert from "@/components/VAlert.vue";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import VHeader from "@/components/VHeader.vue";
import firebase from "firebase";

@Component({
  components: {
    VAlert,
    VButton,
    VInput,
    VHeader
  }
})
export default class SignIn extends Vue {
  alertMessage = "";
  newPassword = "";
  currentPassword = "";
  isPositive = false;
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  clearTheMessage() {
    this.alertMessage = "";
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.isPositive = false;
      this.alertMessage = "Please provide both your current password and the new one";
      return;
    }

    try {
      await Authentication.instance.changePassword(this.user!.email!, this.currentPassword, this.newPassword);

      this.isPositive = true;
      this.currentPassword = "";
      this.newPassword = "";
      this.alertMessage = "Password has been successfully updated";
    } catch (e) {
      this.isPositive = false;
      this.alertMessage = "We couldn't update your password";
    }
  }
}
</script>