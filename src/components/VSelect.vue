<template>
  <div>
    <label class="flex flex-col">
      <span class="text-secondary-text text-left mb-1 text-sm">{{ label }}</span>
      <select
        class="form-select w-full"
        :value="currentSelection"
        @input="$emit('change', $event.target.value)"
      >
        <option v-for="selection in selectionList" :value="selection" :key="selection">
          {{ selection }}
        </option>
      </select>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VSelect extends Vue {
  @Prop() label!: string;
  @Prop() selectionList;
  @Prop() selectedItem;
  currentSelection = null;

  mounted() {
    this.currentSelection = this.selectedItem;
  }
}
</script>
