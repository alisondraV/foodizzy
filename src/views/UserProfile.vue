<template>
  <div>
    <h1>Your Profile</h1>
    <p>Email: {{ user.email }}</p>
    <button @click="goBack">Back</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "@/router";
import firebase from "firebase";
import User = firebase.User;
import Authentication from "@/utils/Authentication";

@Component
export default class AppMain extends Vue {
  user: User = null;

  mounted() {
    this.user = Authentication.getCurrentUser();
  }
  goBack() {
    router.back();
  }
}
</script>
