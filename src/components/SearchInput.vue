<template>
  <div class="flex w-full">
    <div class="flex flex-1 border border-secondary-text rounded-md mr-1">
      <img class="pl-3" src="@/assets/images/Search.svg" alt="Finished" />
      <input
        class="text-primary-text text-sm h-10 w-full pl-2 mr-1 focus:outline-none"
        :value="value"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('input', $event.target.value)"
        type="text"
        placeholder="What are you looking for?"
      />
    </div>
    <div v-if="currentPage === 'storage'">
      <img class="absolute ml-1 xs:ml-2 py-1" src="@/assets/images/TakePhoto.svg" alt="NewProduct" />
      <input
        class="opacity-0 ml-1 xs:ml-2 mt-1"
        accept="image/x-png,image/jpeg,image/gif"
        style="width: 40px"
        type="file"
        @change="e => scanItem(e.target.files)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator';
import Firestore from '@/utils/Firestore';
import { ListName } from '@/utils/enums';
import ML from '@/utils/ML';
import { Product } from '@/types';

@Component
export default class SearchInput extends Vue {
  @Prop() value!: null;
  @Inject('currentPage') currentPage!: string;
  focused = false;

  get isFocused() {
    return this.focused;
  }

  async scanItem(files: File[]): Promise<void> {
    try {
      const file = files[0];
      const image = await ML.toImage(file);

      const predictionTensor = await ML.predict(image);
      const topPredictions = await ML.getTopKResults(predictionTensor, 3);
      console.log(topPredictions);

      await Firestore.instance.addToList([new Product(topPredictions[0].className)], ListName.Storage);
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
