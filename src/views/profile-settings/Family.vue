<template>
  <div>
    <v-header heading="My Family" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else-if="!family" class="flex text-primary-text">
        <span>You don’t have a family yet</span>
        <img class="ml-3" src="@/assets/images/SadFace.svg" alt="No Family" />
      </div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <h1>{{ family.name }}</h1>
        <h2>Members</h2>
        <div>
          <div v-for="member in allMembers" :key="member.email">
            <div>
              {{ member.email + (member.isPending ? " (pending)" : "") }}
            </div>
          </div>
          <div>
            <button @click="addNewMembers">+</button>
          </div>
        </div>
        <v-input
          label="Enter the family name to quit"
          v-model="familyNameInputValue"
        />
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
import { Component, Vue } from "vue-property-decorator";
import Authentication from "@/utils/Authentication";
import Family, { CurrentFamily } from "@/types/Family";
import VButton from "@/components/VButton.vue";
import VHeader from "@/components/VHeader.vue";
import VInput from "@/components/VInput.vue";

@Component({
  components: { VHeader, VButton, VInput }
})
export default class AppMain extends Vue {
  members: string[] = [];
  pendingMembers: string[] = [];
  family: Family | null = null;
  familyNameInputValue = "";
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

  async handleQuit() {
    await CurrentFamily.instance.quit();
    await router.push("/");
  }

  async goToCreateFamily() {
    await router.push("/create-family");
  }

  get allMembers() {
    const allEmails = [...this.members, ...this.pendingMembers];
    return allEmails.map(email => ({
      email,
      isPending: this.pendingMembers.includes(email)
    }));
  }

  get familyNameInputMatch() {
    return this.familyNameInputValue === this.family?.name;
  }
}
</script>
