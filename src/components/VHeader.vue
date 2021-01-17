<template>
  <div class="bg-background flex h-16 px-5 w-full top-0 fixed">
    <span
      class="ml-2 w-4/5 text-2xl place-self-center font-extrabold text-primary-text"
    >
      {{ heading }}
    </span>
    <img
      src="@/assets/images/Profile.svg"
      alt="Profile"
      @click="goToTheProfilePage"
      class="cursor-pointer p-4 w-1/5"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import router from "../router";

@Component
export default class VHeader extends Vue {
  @Prop() heading: string;

  goToTheProfilePage() {
    router.push("/profile");
  }
}
</script>
