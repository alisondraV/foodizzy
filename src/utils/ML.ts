import * as tf from '@tensorflow/tfjs';

import { Tensor, Rank } from '@tensorflow/tfjs';
import labels from '@/assets/object_detection_labels.json';

const MODEL_URL =
  'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/classification/2/default/1';

const IMAGE_SIZE = 224;

// eslint-disable-next-line max-len
// This class wa based on this example: https://github.com/tensorflow/tfjs-examples/tree/aad9b8151458ef6a8d00bcbaa6f6cb12584401af/chrome-extension
export default class ML {
  public static async predict(file: HTMLImageElement): Promise<Tensor<Rank>> {
    console.log('Creating image tensor...');
    const img = await tf.browser.fromPixelsAsync(file);

    const normalized = img.div(tf.scalar(256.0));
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

    console.log('Loading model...');
    const objectDetectionModel = await tf.loadGraphModel(MODEL_URL, { fromTFHub: true });

    console.log('Performing prediction...');
    const output = objectDetectionModel.predict(batched) as Tensor<Rank>;

    // Parse the model output to get meaningful result (get detection class and object location).
    if (output.shape[output.shape.length - 1] === 1001) {
      // Remove the very first logit (background noise).
      return output.slice([0, 1], [-1, 1000]);
    } else if (output.shape[output.shape.length - 1] === 1000) {
      return output;
    }
    throw new Error('Could not make the prediction');
  }

  public static async getTopKResults(logits: Tensor<Rank>, topK: number) {
    const { values, indices } = tf.topk(logits, topK, true);
    const valuesArr = await values.data();
    const indicesArr = await indices.data();
    console.log(`indicesArr ${indicesArr}`);
    const topClassesAndProbs: { className: string; probability: number }[] = [];
    for (let i = 0; i < topK; i++) {
      topClassesAndProbs.push({
        className: labels[indicesArr[i]],
        probability: valuesArr[i]
      });
    }
    return topClassesAndProbs;
  }

  public static toImage(file: File): Promise<HTMLImageElement> {
    const reader = new FileReader();

    return new Promise(resolve => {
      reader.onload = event => {
        const img = new Image();

        img.onload = () => {
          img.width = img.height = IMAGE_SIZE;
          resolve(img);
        };

        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}
