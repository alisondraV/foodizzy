<template>
  <div>
    <div class="flex justify-center mb-2">
      <v-input type="email" label="Email Address" placeholder="Enter member’s email" v-model="currentEmail" />
      <img
        alt="Add"
        class="mt-6 ml-4"
        src="@/assets/images/PlusIcon.svg"
        v-if="isEmailInValidState"
        @click="addEmail"
      />
    </div>
    <div class="text-dark-peach mb-4">{{ errorMessage }}</div>
    <ul>
      <li
        v-for="email in memberEmails"
        :key="email"
        class="flex justify-between items-center text-primary-text bg-light-yellow py-2 px-4 rounded text-sm mb-2"
      >
        <p>{{ email }}</p>
        <img src="@/assets/images/Cross.svg" alt="remove" @click="removeEmail(email)" class="w-4 h-4" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { VInput } from '@/components';
import { ValidationMixin } from '@/mixins';

@Component({
  components: { VInput }
})
export default class EmailsList extends Mixins(ValidationMixin) {
  @Prop() memberEmails!: string[];
  currentEmail = '';

  get isEmailInValidState() {
    this.errorMessage = '';
    this.errorType = '';

    return this.currentEmail !== '' && this.isEmailValid(this.currentEmail);
  }

  addEmail() {
    this.memberEmails.push(this.currentEmail);
    this.currentEmail = '';
  }

  removeEmail(email: string) {
    this.memberEmails.splice(this.memberEmails.indexOf(email), 1);
  }
}
</script>
