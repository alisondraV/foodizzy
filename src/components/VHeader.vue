<template>
  <div class="bg-background flex h-20 px-5 w-full top-0 fixed pt-4">
    <span
      class="ml-4 w-4/5 text-2xl place-self-center font-extrabold text-primary-text"
    >
      {{ heading }}
    </span>
    <img
      v-if="!isProfileOrNewProductPage()"
      src="@/assets/images/Profile.svg"
      alt="Profile"
      @click="goToTheProfilePage"
      class="cursor-pointer p-4 w-1/5"
    />
    <img
      v-else
      src="@/assets/images/Close.svg"
      alt="Close"
      @click="goBack"
      class="cursor-pointer p-4"
      width="55px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "../router";

@Component
export default class VHeader extends Vue {
  @Prop() heading: string;

  isProfileOrNewProductPage() {
    return (
      this.heading.includes("Profile") || this.heading.includes("New Item")
    );
  }

  goBack() {
    router.back();
  }

  goToTheProfilePage() {
    router.push("/profile");
  }
}
</script>
