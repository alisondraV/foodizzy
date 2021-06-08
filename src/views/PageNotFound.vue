<template>
  <div class="mt-16 mx-6 flex flex-col items-center text-primary-text text-center">
    <img src="@/assets/images/404.svg" alt="Invite Members" class="mb-10" />
    <h1 class="text-2xl font-extrabold mb-3">
      Something Went Wrong
    </h1>
    <p class="mb-10">
      Seems like the page you are looking for does not exist.
    </p>
    <v-button class="w-full mb-16" label="Home Page" @click="goToTheHomePage" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PathName } from '@/utils/enums';
import { VButton } from '@/components';
import router from '@/router';

@Component({
  components: {
    VButton
  }
})
export default class PageNotFound extends Vue {
  goToTheHomePage() {
    router.safePush!(PathName.Home);
  }
}
</script>
