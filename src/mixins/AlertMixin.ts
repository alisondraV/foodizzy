import { Component, Vue } from 'vue-property-decorator';

@Component
export class AlertMixin extends Vue {
  alertMessage = '';
  prevTimeout: number | undefined;

  showAlert(message: string) {
    clearTimeout(this.prevTimeout);

    return new Promise(resolve => {
      this.alertMessage = message;

      this.prevTimeout = setTimeout(() => {
        resolve((this.alertMessage = ''));
      }, 3000);
    });
  }
}
