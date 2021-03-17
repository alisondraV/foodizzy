<template>
  <div>
    <v-header heading="Personal Information" />
    <div class="mt-24 mb-20 mx-8 text-primary-text">
      <div v-if="!user">Loading...</div>
      <div v-else>
        <div class="w-full flex flex-col items-center text-center">
          <img
            v-if="user.photoURL"
            alt="profile-image"
            class="mb-4 rounded-full w-1/3"
            :src="user.photoURL"
          />
          <img
            v-else
            alt="profile-image"
            class="mb-4 rounded-full w-1/3"
            src="@/assets/images/DefaultProfile.svg"
          />
          <p class="text-xl place-self-center font-extrabold text-primary-text mb-12">
            {{ user.displayName }}
          </p>
        </div>
        <div class="flex justify-between mb-4">
          <p class="text-primary-text">Personal Information</p>
          <p class="text-dark-peach underline" @click="flipEditMode">
            {{ editMode ? 'Cancel' : 'Edit' }}
          </p>
        </div>

        <hr class="w-full border-secondary-text mb-5" />

        <div class="mb-3">
          <p class="text-sm">Full Name</p>
          <p v-if="!editMode">{{ user.displayName }}</p>
          <v-input v-else v-model="newName" class="w-full" />
        </div>
        <div>
          <p class="text-sm">Email</p>
          <p v-if="!editMode">{{ user.email }}</p>
          <v-input v-else v-model="newEmail" class="mb-3 w-full" />
        </div>
      </div>
    </div>

    <div v-if="editMode" class="bg-background h-24 w-full bottom-0 fixed">
      <v-button class="mx-8" label="Save" @click="saveChanges" />
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component, Vue } from 'vue-property-decorator';
import Authentication from '@/utils/Authentication';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import VHeader from '@/components/VHeader.vue';

@Component({
  components: { VButton, VInput, VHeader }
})
export default class PersonalInformation extends Vue {
  editMode = false;
  newName: string | null = '';
  newEmail: string | null = '';
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  async saveChanges() {
    await Authentication.instance.updateCurrentUser(this.user!, this.newName, this.newEmail);
    this.flipEditMode();
  }

  flipEditMode() {
    this.newName = this.user!.displayName;
    this.newEmail = this.user!.email;
    this.editMode = !this.editMode;
  }
}
</script>
