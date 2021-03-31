<template>
  <div>
    <v-header heading="Change Password" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mb-20 mx-8" :class="alertMessage ? 'mt-6' : 'mt-20'">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <v-input
          class="mb-6 w-full"
          type="password"
          label="Current Password"
          placeholder="Enter your current password"
          v-model="currentPassword"
          @focus="clearTheMessage"
        />
        <v-input
          class="mb-6 w-full"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          v-model="newPassword"
          @focus="clearTheMessage"
        />
        <div class="grid grid-cols-2 self-start text-left">
          <div :class="passwordValidation.hasLowerCase ? 'text-primary-green' : 'text-dark-peach'">
            1 lowercase
          </div>
          <div :class="passwordValidation.hasUpperCase ? 'text-primary-green' : 'text-dark-peach'">
            1 uppercase
          </div>
          <div :class="passwordValidation.hasSpecial ? 'text-primary-green' : 'text-dark-peach'">
            1 special
          </div>
          <div :class="passwordValidation.hasNumber ? 'text-primary-green' : 'text-dark-peach'">1 number</div>
          <div :class="passwordValidation.isLong ? 'text-primary-green' : 'text-dark-peach'">
            8 characters
          </div>
        </div>
        <div class="text-dark-peach self-start text-left">{{ errorMessage }}</div>

        <div class="bg-background h-24 w-full bottom-0 fixed">
          <v-button
            class="mx-8 mt-3"
            label="Change Password"
            @click="changePassword"
            :disabled="validationFailed"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import Authentication from '@/utils/Authentication';
import VAlert from '@/components/VAlert.vue';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import VHeader from '@/components/VHeader.vue';
import firebase from 'firebase';
import { AlertMixin, ValidationMixin } from '@/mixins';

@Component({
  components: {
    VAlert,
    VButton,
    VInput,
    VHeader
  }
})
export default class SignIn extends Mixins(ValidationMixin, AlertMixin) {
  alertMessage = '';
  newPassword = '';
  currentPassword = '';
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  clearTheMessage() {
    this.alertMessage = '';
  }

  @Watch('newPassword')
  handlePasswordUpdate() {
    this.updatePasswordValidation(this.newPassword);
  }

  get isFormInValidState() {
    return this.isPasswordValid();
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword) {
      this.showAlert('Please provide both your current password and the new one', 'danger');
      return;
    }

    try {
      await Authentication.instance.changePassword(this.user!.email!, this.currentPassword, this.newPassword);

      this.currentPassword = '';
      this.newPassword = '';
      this.showAlert('Password has been successfully updated', 'success');
    } catch (e) {
      this.showAlert("We couldn't update your password", 'danger');
    }
  }
}
</script>
