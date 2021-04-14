<template>
  <div>
    <v-header heading="Your Profile" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <img v-if="user.photoURL" alt="profile-image" class="mb-4 rounded-full w-1/3" :src="user.photoURL" />
        <img
          v-else
          alt="profile-image"
          class="mb-4 rounded-full w-1/3"
          src="@/assets/images/DefaultProfile.svg"
        />
        <p class="text-xl place-self-center font-extrabold text-primary-text mb-12">
          {{ user.displayName }}
        </p>
        <ul class="w-full text-primary-text ">
          <li class="flex justify-between mb-4" @click="viewPersonalInfo">
            <img src="@/assets/images/ProfileGreen.svg" alt="Information" />
            <span class="flex-1 text-left ml-4">Personal information</span>
            <img src="@/assets/images/ArrowRight.svg" alt="Go" />
          </li>
          <li class="flex justify-between mb-5" @click="changePassword">
            <img src="@/assets/images/Password.svg" alt="Password" />
            <span class="flex-1 text-left ml-4">Change Password</span>
            <img src="@/assets/images/ArrowRight.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-5" />

          <li class="flex justify-between mb-5" @click="viewFamily">
            <img src="@/assets/images/Family.svg" alt="Family" />
            <span class="flex-1 text-left ml-4">My Family</span>
            <img src="@/assets/images/ArrowRight.svg" alt="Go" />
          </li>
          <li class="flex justify-between mb-5" @click="viewInvitations">
            <img src="@/assets/images/Invitations.svg" alt="Invitations" />
            <span class="flex-1 text-left ml-4">My invitations</span>
            <img src="@/assets/images/ArrowRight.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-5" />

          <li class="flex" @click="logOut">
            <img src="@/assets/images/LogOut.svg" alt="Log Out" />
            <span class="flex-1 text-left ml-4">Log Out</span>
            <img src="@/assets/images/ArrowRight.svg" alt="Go" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import router from '@/router';
import { Component, Vue } from 'vue-property-decorator';
import { CurrentFamily, Family } from '@/types';
import Authentication from '@/utils/Authentication';
import VButton from '@/components/VButton.vue';
import VHeader from '@/components/VHeader.vue';

@Component({
  components: { VButton, VHeader }
})
export default class AppMain extends Vue {
  family: Family | null = null;
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    this.family = await CurrentFamily.instance.getCurrentFamily();
  }

  async changePassword() {
    await router.push('/change-password');
  }

  async logOut() {
    await Authentication.instance.signOut();
    await router.safePush('/sign-in');
  }

  async viewFamily() {
    await router.push('/family');
  }

  async viewInvitations() {
    await router.push('/invitations');
  }

  async viewPersonalInfo() {
    await router.push('/personal-info');
  }
}
</script>
