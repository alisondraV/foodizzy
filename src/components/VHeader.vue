<template>
  <div class="bg-background flex h-20 px-5 w-full top-0 fixed pt-4">
    <span
      class="ml-4 w-4/5 text-small-header xs:text-header place-self-center font-extrabold text-primary-text"
    >
      {{ heading }}
    </span>
    <img
      v-if="showProfile()"
      src="@/assets/images/Profile.svg"
      alt="Profile"
      @click="goToTheProfilePage"
      class="cursor-pointer p-4 w-1/5"
    />
    <img
      v-if="showClose()"
      src="@/assets/images/Close.svg"
      alt="Close"
      @click="goBack"
      class="cursor-pointer p-4"
      width="55px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import router from '../router';
import { CurrentFamily, Family } from '@/types';

@Component
export default class VHeader extends Vue {
  @Prop() heading!: string;
  family: Family | null = null;

  pagesWithoutProfileLink = [
    'profile',
    'product',
    'personal-info',
    'change-password',
    'family',
    'invitations',
    'invite-members'
  ];

  async mounted() {
    this.family = await CurrentFamily.instance.getCurrentFamily();
  }

  showProfile() {
    const filteredPages = this.pagesWithoutProfileLink.filter(page => this.$route.path.includes(page));
    return filteredPages.length === 0;
  }

  showClose() {
    if (this.heading.includes('Your Profile')) return this.family;
    return !this.showProfile();
  }

  goBack() {
    router.back();
  }

  goToTheProfilePage() {
    router.safePush('/profile');
  }
}
</script>
