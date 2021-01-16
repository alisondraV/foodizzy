<template>
  <div>
    <h1>Your Profile</h1>
    <div v-if="!user">
      Loading...
    </div>
    <div v-else>
      <p>Email: {{ user.email }}</p>
      <img :src="user.photoURL" alt="profile-image" />
    </div>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
import firebase from "firebase";
import Authentication from "@/utils/Authentication";

@Component
export default class AppMain extends Vue {
  user: firebase.User | null = null;

  async mounted() {
    this.user = await Authentication.getCurrentUser();
  }

  goBack() {
    router.back();
  }
}
</script>
