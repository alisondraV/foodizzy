<template>
  <div class="flex w-full">
    <div class="flex border border-secondary-text rounded-md">
      <img class="pl-4" src="@/assets/images/Search.svg" alt="Finished" />
      <input
        class="text-primary-text h-10 w-full p-4 mr-2 focus:outline-none"
        :value="value"
        @focus="focused = true"
        @blur="focused = false"
        @input="$emit('input', $event.target.value)"
        type="text"
        placeholder="What are you looking for?"
      />
    </div>
    <div>
      <img class="absolute ml-3 py-1 w-6 mt-1" src="@/assets/images/Plus.svg" alt="NewProduct" />
      <input
        class="opacity-0 ml-3 mt-1 w-6"
        type="file"
        accept="image/x-png,image/jpeg,image/gif"
        @change="e => scanItem(e.target.files)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as tf from '@tensorflow/tfjs';
import Firestore from '@/utils/Firestore';

@Component
export default class SearchInput extends Vue {
  @Prop() value!: null;
  focused = false;

  get isFocused() {
    return this.focused;
  }

  async scanItem(files) {
    // console.log(files);

    // const model = await tf.loadGraphModel('../../food-model/model.json');
    const model = await Firestore.instance.getModel();
    const image = new Image();
    image.src = URL.createObjectURL(files[0]);
    const input = tf.browser.fromPixels(image);
    console.log(model.predict(input));
  }
}
</script>
