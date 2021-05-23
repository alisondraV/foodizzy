<template>
  <div
    class="bg-background flex justify-between h-20 px-5 w-full bottom-0 fixed"
    style="box-shadow: #f0f0f0 0 -10px 20px"
  >
    <img
      v-for="navigationOption in navigationOptions"
      :key="navigationOption.pathName"
      :src="navigationOption.icon"
      :alt="navigationOption.pathName"
      @click="goToPage(navigationOption.pathName)"
      class="mb-6 p-3"
      :style="isCurrentPageStyle(navigationOption.pathName)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Icons } from '@/utils/consts';
import router from '../router';

@Component
export default class NavigationMenu extends Vue {
  navigationOptions = [
    {
      pathName: '/',
      icon: Icons.Statistics
    },
    {
      pathName: '/storage',
      icon: Icons.Storage
    },
    {
      pathName: '/shopping-list',
      icon: Icons.ShoppingList
    },
    {
      pathName: '/recipes',
      icon: Icons.Recipes
    }
  ];

  isCurrentPageStyle(page: string) {
    return page == window.location.pathname
      ? 'filter: invert(31%) sepia(38%) saturate(6483%) hue-rotate(160deg) brightness(91%) contrast(99%)'
      : '';
  }

  goToPage(pathName) {
    router.safePush(pathName);
  }
}
</script>
