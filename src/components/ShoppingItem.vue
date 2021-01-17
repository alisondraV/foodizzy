<template>
  <div class="flex justify-between items-center py-3 text-xl left-0">
    <img
      v-if="product.acquired"
      src="@/assets/images/Check.svg"
      alt="Acquired"
      @click="$emit('update', product)"
    />
    <img
      v-else
      src="@/assets/images/Empty.svg"
      alt="Acquired"
      @click="$emit('update', product)"
    />
    <span class="flex-1 ml-4">{{ product.name }}</span>
    <img
      src="@/assets/images/Close.svg"
      alt="Wasted"
      @click="$emit('remove', product)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ShoppingListItem from "@/types/ShoppingListItem";

@Component
export default class ShoppingItem extends Vue {
  @Prop() product: ShoppingListItem;
}
</script>
