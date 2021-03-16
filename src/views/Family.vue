<template>
  <div>
    <v-header heading="Your Family" />
    <div class="mt-24 mb-20 mx-8">
      <div v-if="!family">Loading...</div>
      <div v-else class="w-full flex flex-col items-center text-center">
        <h1>{{ family.name }}</h1>
        <h2>Members</h2>
        <div>
          <div v-for="member in allMembers" :key="member.email">
            <div>
              {{ member.email + (member.isPending ? ' (pending)' : '') }}
            </div>
          </div>
          <div>
            <button @click="addNewMembers">+</button>
          </div>
        </div>
        <v-input
          label="Enter the family name to quit"
          v-model="familyNameInputValue"
        />
        <v-button
          label="Quit Family"
          @click="handleQuit"
          :disabled="!familyNameInputMatch"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VHeader from '@/components/VHeader.vue';
import VButton from '@/components/VButton.vue';
import VInput from '@/components/VInput.vue';
import Family, { CurrentFamily } from '@/types/Family';
import router from '@/router';

@Component({
  components: { VHeader, VButton, VInput }
})
export default class AppMain extends Vue {
  members: string[] = [];
  pendingMembers: string[] = [];
  family: Family | null = null;
  familyNameInputValue = '';

  async mounted() {
    this.family = await CurrentFamily.instance.getCurrentFamily();
    await CurrentFamily.instance.listenForChanges(snapshot => {
      const family = snapshot.data() as Family;
      this.members = family?.members ?? [];
      this.pendingMembers = family?.pendingMembers ?? [];
    });
  }

  async addNewMembers() {
    router.safePush('/new-family-members');
  }

  async handleQuit() {
    await CurrentFamily.instance.quit();
    router.safePush('/');
  }

  get allMembers() {
    const allEmails = [...this.members, ...this.pendingMembers];
    return allEmails.map(email => ({
      email,
      isPending: this.pendingMembers.includes(email)
    }));
  }

  get familyNameInputMatch() {
    return this.familyNameInputValue === this.family?.name;
  }
}
</script>
