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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VHeader from "@/components/VHeader.vue";
import Family from "@/types/Family";
import Firestore from "@/utils/Firestore";
import router from "@/router";

@Component({
  components: { VHeader }
})
export default class AppMain extends Vue {
  family: Family | null = null;
  members: string[] = [];

  async mounted() {
    this.family = await Firestore.instance.getCurrentFamily();
    await Firestore.instance.listenForMemberChanges((snapshot) => this.members = (snapshot.data() as Family).members)
  }

  async addNewMembers() {
    router.push('/new-family-members');
  }
}
</script>
