<template>
  <div>
    <v-header heading="Your Profile" />
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
        <ul>
          <li class="flex justify-between w-full">
            <img src="@/assets/images/ProfileGreen.svg" alt="Information" />
            <span>Personal information</span>
            <img src="@/assets/images/Arrow.svg" alt="Go" />
          </li>
          <li class="flex justify-between w-full" @click="viewFamily">
            <img src="@/assets/images/Password.svg" alt="Password" />
            <span>Change Password</span>
            <img src="@/assets/images/Arrow.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-6" />

          <li class="flex justify-between w-full" @click="viewFamily">
            <img src="@/assets/images/Family.svg" alt="Family" />
            <span>My Family</span>
            <img src="@/assets/images/Arrow.svg" alt="Go" />
          </li>

          <hr class="w-full border-secondary-text mb-6" />

          <li class="flex justify-between w-full" @click="logOut">
            <img src="@/assets/images/LogOut.svg" alt="Log Out" />
            <span>Log Out</span>
            <img src="@/assets/images/Arrow.svg" alt="Go" />
          </li>
        </ul>
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
import Family, { CurrentFamily } from "@/types/Family";
import router from "@/router";

@Component({
  components: { VHeader, VButton }
})
export default class AppMain extends Vue {
  user: firebase.User | null = null;
  family: Family | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    this.family = await CurrentFamily.instance.getCurrentFamily();
  }

  async viewFamily() {
    await router.push("/family");
  }

  async logOut() {
    await Authentication.instance.signOut();
    await router.push("/sign-in");
  }
}
</script>
