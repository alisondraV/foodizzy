<template>
  <div class="bg-background flex justify-between h-20 px-5 w-full top-0 fixed pt-4 z-50">
    <span
      class="ml-4 text-small-header xs:text-header place-self-center font-extrabold text-primary-text"
    >
      {{ heading }}
    </span>
    <img
      alt="Profile"
      class="py-4 pr-3"
      data-cy="profile-button"
      width="50px"
      src="@/assets/images/Profile.svg"
      v-if="showProfile()"
      @click="goToTheProfilePage"
    />
    <img
      v-if="showClose()"
      src="@/assets/images/Cross.svg"
      style="filter: invert(67%) sepia(12%) saturate(1440%) hue-rotate(316deg) brightness(92%) contrast(83%)"
      alt="Close"
      @click="goBack"
      data-cy="close"
      class="cursor-pointer p-4"
      width="55px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CurrentFamily, Family } from '@/types';
import { PathName } from '@/utils/enums';
import router from '../router';

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
    router.safePush!(PathName.UserProfile);
  }
}
</script>
