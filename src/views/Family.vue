<template>
  <div>
    <v-header heading="Your Family" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!family">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <h1>{{ family.name }}</h1>
        <h2>Members</h2>
        <div>
            <div v-for="email in members" :key="email">
              <div>{{ email }}</div>
            </div>
            <div>
                <button @click="addNewMembers">+</button>
            </div>
        </div>
        <v-button label="Quit Family" @click="handleQuit"></v-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VHeader from "@/components/VHeader.vue";
import VButton from "@/components/VButton.vue";
import Family, { CurrentFamily } from "@/types/Family";
import router from "@/router";

@Component({
  components: { VHeader, VButton }
})
export default class AppMain extends Vue {
  members: string[] = [];
  family: Family | null = null;

  async mounted() {
    this.family = await CurrentFamily.instance.getCurrentFamily();
    await CurrentFamily.instance.listenForMemberChanges((snapshot) => this.members = (snapshot.data() as Family).members)
  }

  async addNewMembers() {
    router.push('/new-family-members');
  }

  async handleQuit() {
    await CurrentFamily.instance.quit();
    router.push('/');
  }
}
</script>
