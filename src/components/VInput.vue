<template>
  <div>
    <label class="flex flex-col relative text-secondary-text">
      <input
        class="focus:outline-none rounded-md text-primary-text h-10 p-4
                border border-secondary-text focus:border-primary-green"
        @input="$emit('input', $event.target.value)"
        :placeholder="label"
        :type="type"
        :value="value"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class VInput extends Vue {
  @Prop() value!: null;
  @Prop() label!: string;
  @Prop({ default: "text" }) type?: string;
}
</script>
