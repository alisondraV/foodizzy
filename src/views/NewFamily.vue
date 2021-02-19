<template>
  <div class="m-8 flex flex-col h-screen">
    <p class="text-2xl font-bold text-primary-text mb-6">Create Your Family</p>
    <div class="mb-8 flex-start">
      <v-input
        class="mb-6"
        type="text"
        label="Family Name"
        v-model="familyName"
      />
      <p class="text-1xl font-bold text-primary-text mb-4">
        Invite Family Members
      </p>
      <div class="flex flex-row justify-between mb-4">
        <v-input
          class="w-4/5"
          type="email"
          label="Email Address"
          v-model="currentEmail"
        />
        <img src="@/assets/images/Plus.svg" alt="Add" @click="addEmail" />
      </div>
      <ul>
        <li
          v-for="email in memberEmails"
          :key="email"
          class="flex justify-between color-red bg-red p-2 items-center py-3 text-lg"
        >
          <p>{{ email }}</p>
          <img
            src="@/assets/images/Close.svg"
            alt="remove"
            @click="removeEmail(email)"
            class="w-4 h-4"
          />
        </li>
      </ul>
    </div>
    <div>
      <v-button label="Create Family" @click="createFamily" />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import router from "@/router";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import Firestore from "@/utils/Firestore";
import firebase from "firebase";

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignIn extends Vue {
  familyName = "";
  memberEmails: string[] = [];
  currentEmail = "";
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
  }

  async createFamily() {
    await Firestore.instance.createFamily(this.familyName, [
      this.user!.uid,
      ...this.memberEmails
    ]);
    await router.push("/");
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = "";
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
