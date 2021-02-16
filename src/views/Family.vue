<template>
  <div>
    <v-header heading="Your Family" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!user">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <h1>{{ family.name }}</h1>
        <h2>Members</h2>
        <div>
            <div v-for="email in family.members" :key="email">
              <div>{{ email }}</div>
            </div>
            <div>
                <button>+</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";
import Authentication from "@/utils/Authentication";
import VHeader from "@/components/VHeader.vue";
import Family from "@/types/Family";
import Firestore from "@/utils/Firestore";
import router from "@/router";

@Component({
  components: { VHeader }
})
export default class AppMain extends Vue {
  user: firebase.User | null = null;
  family: Family | null = null;

  async mounted() {
    this.user = await Authentication.instance.getCurrentUser();
    this.family = await Firestore.instance.getFamilyForUser(this.user!);
  }
}
</script>
