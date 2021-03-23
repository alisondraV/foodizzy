import { CurrentFamily } from '@/types';
import Family from '@/types/Family';
import { Component, Vue } from 'vue-property-decorator';

@Component
export class ListenerMixin extends Vue {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFamilyUpdate: ((family: Family) => void) | undefined;
  unsubscribeFamilyListener: (() => void) | undefined;

  async mounted() {
    this.unsubscribeFamilyListener = await CurrentFamily.instance.listenForChanges(snapshot => {
      const family = snapshot.data() as Family;
      if (this.onFamilyUpdate) {
        console.log('Triggered onFamilyUpdate');
        this.onFamilyUpdate(family);
      }
    });
  }

  destroyed() {
    if (this.unsubscribeFamilyListener) {
      console.log('unsub');
      this.unsubscribeFamilyListener();
    }
  }
}
