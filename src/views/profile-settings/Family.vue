<template>
  <div>
    <v-header heading="My Family" />
    <div class="mt-20">
      <v-alert v-if="alertMessage" :label="alertMessage" :status="alertStatus" />
    </div>
    <div class="mx-8 text-primary-text" :class="alertMessage ? '' : 'mt-20'">
      <div v-if="loading">Loading...</div>
      <div v-else-if="!family" class="flex">
        <h2>You don’t have a family yet</h2>
        <img class="ml-3" src="@/assets/images/SadFace.svg" alt="No Family" />
      </div>
      <div v-else>
        <div class="w-screen -mx-8 bg-light-yellow text-header font-extrabold py-5 pl-8">
          <div class="flex" v-if="!inEditingState">
            {{ family.name }}
            <img
              alt="Edit"
              class="ml-4"
              data-cy="edit"
              src="@/assets/images/Edit.svg"
              @click="editFamilyName"
            />
          </div>
          <div v-else class="flex justify-between">
            <label>
              <input
                class="w-3/4 bg-light-yellow border-b"
                data-cy="new-name"
                type="text"
                v-model="newFamilyName"
              />
            </label>
            <v-button class="mr-8 w-1/4 h-10 -mt-2" data-cy="save" label="Done" @click="updateFamilyName" />
          </div>
        </div>
        <h2 class="mt-6 text-lg">Members</h2>
        <div v-if="familyMembers" class="mt-3 flex flex-wrap -mx-4">
          <div class="flex flex-col items-center mx-4" v-for="member in familyMembers" :key="member.email">
            <img
              v-if="member.photoURL"
              alt="profile-image"
              class="mb-4 rounded-full"
              width="45px"
              :src="member.photoURL"
            />
            <img
              v-else
              alt="Profile Image"
              class="mb-4 rounded-full"
              src="@/assets/images/DefaultProfile.svg"
              width="45px"
            />
            <div>
              {{ getFirstName(member) }}
            </div>
          </div>
          <img
            alt="Add New"
            class="-mt-6 mb-4 rounded-full mx-4"
            width="45px"
            src="@/assets/images/AddNew.svg"
            @click="addNewMembers"
          />
        </div>

        <h2 class="mb-4 mt-6 text-lg">Your Family’s Invitations</h2>
        <div v-if="pendingMembers.length === 0" class="text-dark-peach -mt-2">
          No pending invitations.
        </div>
        <div v-else v-for="invitation in pendingMembers" :key="invitation">
          <div class="flex w-full justify-between mb-3">
            <div class="flex-1">
              {{ invitation }}
            </div>
            <div class="text-primary-green mr-4" @click="handleResendInvite(invitation)">
              Resend
            </div>
            <div class="text-dark-peach" data-cy="cancel-invite" @click="handleCancelInvitation(invitation)">
              Cancel
            </div>
          </div>
          <hr class="w-full border-secondary-text mb-6" />
        </div>
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button v-if="family" class="mx-8 mt-3" label="Quit My Family" @click="handleQuit" />
      <v-button v-else class="mx-8 mt-3" label="Create Family" @click="goToCreateFamily" />
    </div>
  </div>
</template>

<script lang="ts">
import { AlertMixin, ListenerMixin } from '@/mixins';
import { Component, Mixins } from 'vue-property-decorator';
import { CurrentFamily, Family } from '@/types';
import { VAlert, VButton, VHeader, VInput } from '@/components';
import { AlertStatus } from '@/utils/enums';
import Authentication from '@/utils/Authentication';
import Firestore from '@/utils/Firestore';
import firebase from 'firebase';
import router from '@/router';

@Component({
  components: { VAlert, VButton, VHeader, VInput }
})
export default class AppMain extends Mixins(AlertMixin, ListenerMixin) {
  inEditingState = false;
  loading = false;
  family: Family | null = null;
  familyMembers: firebase.User[] = [];
  newFamilyName = '';
  pendingMembers: string[] = [];
  user: firebase.User | null = null;

  async mounted() {
    this.loading = true;
    this.user = await Authentication.instance.getCurrentUser();
    this.family = await CurrentFamily.instance.getCurrentFamily(true);

    this.onFamilyUpdate = family => {
      this.pendingMembers = family?.pendingMembers ?? [];
    };

    try {
      this.familyMembers = await Firestore.instance.getUsersByEmail(this.family.members);
    } catch (e) {
      console.log("Couldn't getUsersByEmail: ", e.message);
    }
    this.loading = false;
  }

  async addNewMembers() {
    await router.push('/invite-members');
  }

  editFamilyName() {
    this.inEditingState = true;
    this.newFamilyName = this.family!.name;
  }

  async goToCreateFamily() {
    await router.push('/create-family');
  }

  async handleResendInvite(invitation: string) {
    try {
      await CurrentFamily.instance.inviteMembers([invitation]);
      await this.showAlert('The invitation has been resent', AlertStatus.Success);
    } catch (e) {
      await this.showAlert("Couldn't resend the invitation", AlertStatus.Danger);
    }
  }

  async handleCancelInvitation(invitation: string) {
    try {
      await CurrentFamily.instance.cancelInvitation(invitation);
      await this.showAlert('The invitation has been canceled');
    } catch (e) {
      await this.showAlert("Couldn't cancel the invitation", AlertStatus.Danger);
    }
  }

  async handleQuit() {
    await router.push('/quit-family');
  }

  async updateFamilyName() {
    try {
      await CurrentFamily.instance.updateFamilyName(this.newFamilyName);
      this.family = await CurrentFamily.instance.getCurrentFamily(true);
      this.inEditingState = false;
      await this.showAlert('Your family name has been updated', AlertStatus.Success);
    } catch (e) {
      await this.showAlert("Couldn't update the family name", AlertStatus.Danger);
    }
  }

  getFirstName(member: firebase.User) {
    const name = member?.displayName ?? '';
    return name.substr(0, name?.indexOf(' ')) || name;
  }
}
</script>
