<template>
  <div class="m-8">
    <div class="mb-4 flex">
        <p class="text-4xl font-bold text-primary-text">Create Your Family!</p>
        <img src="@/assets/images/LogoMain.svg" alt="Logo" class="p-4" />
    </div>
    <div class="mb-8">
      <v-input
        class="mb-6"
        type="text"
        label="Family Name"
        v-model="familyName"
      />
      <v-input
        class="mb-6"
        type="email"
        label="Email Address"
        v-model="currentEmail"
        @blur="addEmail"
      />
    </div>
    <div class="mb-8">
      <v-button class="mb-6" label="Create Family" @click="createFamily" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import router from "@/router";
import VButton from "@/components/VButton.vue";
import VInput from "@/components/VInput.vue";
import Firestore from "@/utils/Firestore";

@Component({
  components: {
    VInput,
    VButton
  }
})
export default class SignIn extends Vue {
  familyName = ''
  memberEmails: string[] = []
  currentEmail = ''

  async createFamily() {
    console.log('Family Created');
    
  }

  addEmail() {
      this.memberEmails.push(this.currentEmail);
  }
}
</script>
