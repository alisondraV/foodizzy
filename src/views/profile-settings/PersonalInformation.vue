<template>
  <div>
    <v-header heading="Personal Information" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <img
          class="mb-4 rounded-full w-1/3"
          :src="user.photoURL"
          alt="profile-image"
        />
        <p
          class="text-xl place-self-center font-extrabold text-primary-text mb-8"
        >
          {{ user.displayName }}
        </p>
      </div>
      <div class="flex justify-between mb-5">
        <p>Personal Information</p>
        <p>Edit</p>
      </div>
      <hr class="w-full border-secondary-text mb-5" />
      <div>
        <p>Full Name</p>
        <p>{{ user.displayName }}</p>
      </div>
      <div>
        <p>Email</p>
        <p>{{ user.email }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "firebase";
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import VHeader from "@/components/VHeader.vue";

@Component({
  components: { VHeader }
})
export default class PersonalInformation extends Vue {
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }
}
</script>
