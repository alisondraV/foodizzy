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
          <li class="flex justify-between mb-4" data-cy="personal-info" @click="viewPersonalInfo">
            <img src="@/assets/images/ProfileGreen.svg" alt="Information" />
            <span class="flex-1 text-left ml-4">Personal information</span>
            <img class="transform -rotate-90" src="@/assets/images/Arrow.svg" alt="Go" />
          </li>
          <li class="flex justify-between mb-5" data-cy="password" @click="changePassword">
            <img src="@/assets/images/Password.svg" alt="Password" />
            <span class="flex-1 text-left ml-4">Change Password</span>
            <img class="transform -rotate-90" src="@/assets/images/Arrow.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-5" />

          <li class="flex justify-between mb-5" data-cy="family" @click="viewFamily">
            <img src="@/assets/images/Family.svg" alt="Family" />
            <span class="flex-1 text-left ml-4">My Family</span>
            <img class="transform -rotate-90" src="@/assets/images/Arrow.svg" alt="Go" />
          </li>
          <li class="flex justify-between mb-5" @click="viewInvitations">
            <img src="@/assets/images/Invitations.svg" alt="Invitations" />
            <span class="flex-1 text-left ml-4">My invitations</span>
            <img class="transform -rotate-90" src="@/assets/images/Arrow.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-5" />

          <li class="flex" data-cy="log-out" @click="logOut">
            <img src="@/assets/images/LogOut.svg" alt="Log Out" />
            <span class="flex-1 text-left ml-4">Log Out</span>
            <img class="transform -rotate-90" src="@/assets/images/Arrow.svg" alt="Go" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CurrentFamily, Family } from '@/types';
import { VButton, VHeader } from '@/components';
import Authentication from '@/utils/Authentication';
import { PathName } from '@/utils/enums';
import firebase from 'firebase';
import router from '@/router';
import { onMounted, ref } from 'vue';

const family = ref<Family | null>(null);
const user = ref<firebase.User | null>(null);

onMounted(async () => {
  user.value = await Authentication.instance.getCurrentUser();
  family.value = await CurrentFamily.instance.getCurrentFamily();
});

async function changePassword() {
  await router.safePush!(PathName.ChangePassword);
}

async function logOut() {
  await Authentication.instance.signOut();
  await router.safePush!(PathName.SignIn);
}

async function viewFamily() {
  await router.safePush!(PathName.Family);
}

async function viewInvitations() {
  await router.safePush!(PathName.Invitations);
}

async function viewPersonalInfo() {
  await router.safePush!(PathName.PersonalInformation);
}
</script>
