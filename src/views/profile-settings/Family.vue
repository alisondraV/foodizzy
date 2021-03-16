<template>
  <div>
    <v-header heading="My Family" />
    <div class="mt-20">
      <v-alert
        v-if="alertMessage"
        :isPositive="isPositive"
        :label="alertMessage"
      />
    </div>
    <div class="mx-8 text-primary-text" :class="alertMessage ? '' : 'mt-24'">
      <div v-if="!user">Loading...</div>
      <div v-else-if="!family" class="flex">
        <h2>You don’t have a family yet</h2>
        <img class="ml-3" src="@/assets/images/SadFace.svg" alt="No Family" />
      </div>
      <div v-else>
        <div
          class="w-screen -mx-8 bg-light-yellow text-header font-extrabold py-5 pl-8"
        >
          <div class="flex" v-if="!newFamilyName">
            {{ family.name }}
            <img
              alt="Edit"
              class="ml-4"
              src="@/assets/images/Edit.svg"
              @click="editFamilyName"
            />
          </div>
          <div v-else class="flex justify-between">
            <label>
              <input
                class="w-3/4 bg-light-yellow border-b"
                type="text"
                v-model="newFamilyName"
              />
            </label>
            <v-button
              class="mr-8 w-1/4 h-10 -mt-2"
              label="Done"
              @click="updateFamilyName"
            />
          </div>
        </div>
        <h2 class="mt-6 text-lg">Members</h2>
        <div class="mt-3 flex flex-wrap -mx-4">
          <div class="mx-4" v-for="member in familyMembers" :key="member.email">
            <img
              v-if="member.photoURL"
              alt="profile-image"
              class="mb-4 rounded-full"
              :src="member.photoURL"
            />
            <img
              v-else
              alt="Profile Image"
              class="mb-4 rounded-full"
              src="@/assets/images/DefaultMember.svg"
            />
            <div>
              {{ member.displayName }}
            </div>
          </div>
          <img
            alt="Add New"
            class="mb-4 rounded-full mx-4"
            src="@/assets/images/AddNewMember.svg"
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
            <div
              class="text-primary-green mr-4"
              @click="handleResendInvite(invitation)"
            >
              Resend
            </div>
            <div
              class="text-dark-peach"
              @click="handleCancelInvitation(invitation)"
            >
              Cancel
            </div>
          </div>
          <hr class="w-full border-secondary-text mb-6" />
        </div>
      </div>
    </div>
    <div class="bg-background h-24 w-full bottom-0 fixed">
      <v-button
        v-if="family"
        class="mx-8 mt-3"
        label="Quit My Family"
        @click="handleQuit"
      />
      <v-button
        v-else
        class="mx-8 mt-3"
        label="Create Family"
        @click="goToCreateFamily"
      />
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import router from "@/router";
import { Component } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import Family, { CurrentFamily } from "@/types/Family";
import Firestore from "@/utils/Firestore";
import VAlert from "@/components/VAlert.vue";
import VButton from "@/components/VButton.vue";
import VHeader from "@/components/VHeader.vue";
import VInput from "@/components/VInput.vue";
import { AlertMixin } from "@/components/AlertMixin";

@Component({
  components: { VAlert, VHeader, VButton, VInput }
})
export default class AppMain extends AlertMixin {
  family: Family | null = null;
  newFamilyName = "";
  isPositive = false;
  members: string[] = [];
  pendingMembers: string[] = [];
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();

    this.family = await CurrentFamily.instance.getCurrentFamily();
    await CurrentFamily.instance.listenForChanges(snapshot => {
      const family = snapshot.data() as Family;
      this.members = family?.members ?? [];
      this.pendingMembers = family?.pendingMembers ?? [];
    });
  }

  async addNewMembers() {
    await router.push("/new-family-members");
  }

  editFamilyName() {
    this.newFamilyName = this.family?.name;
  }

  async goToCreateFamily() {
    await router.push("/create-family");
  }

  async handleResendInvite(invitation: string) {
    try {
      this.isPositive = true;
      await CurrentFamily.instance.inviteMembers([invitation]);
      await this.showAlert("The invitation has been resent");
    } catch (e) {
      await this.showAlert("Couldn't resend the invitation");
    }
  }

  async handleCancelInvitation(invitation: string) {
    try {
      await CurrentFamily.instance.cancelInvitation(invitation);
      this.isPositive = false;
      await this.showAlert("The invitation has been canceled");
    } catch (e) {
      await this.showAlert("Couldn't cancel the invitation");
    }
  }

  async handleQuit() {
    await router.push("/quit-family");
  }

  async updateFamilyName() {
    try {
      await CurrentFamily.instance.updateFamilyName(this.newFamilyName);
      this.isPositive = true;
      this.family = await CurrentFamily.instance.getCurrentFamily();
      this.newFamilyName = "";
      await this.showAlert("Your family name has been updated");
    } catch (e) {
      this.isPositive = false;
      await this.showAlert("Couldn't update the family name");
    }
  }

  get familyMembers() {
    return this.members.map(email => {
      return Firestore.instance.getUserByEmail(email);
    });
  }

  get familyNameInputMatch() {
    return this.familyNameInputValue === this.family?.name;
  }
}
</script>