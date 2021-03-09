<template>
  <div>
    <v-header heading="Change Password" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <v-input
          class="mb-6 w-full"
          type="password"
          label="Old Password"
          v-model="oldPassword"
        />
        <v-input
          class="mb-6 w-full"
          type="password"
          label="New Password"
          v-model="newPassword"
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
  newPassword = "";
  oldPassword = "";
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  async changePassword() {
    await router.push("/profile");
  }
}
</script>
