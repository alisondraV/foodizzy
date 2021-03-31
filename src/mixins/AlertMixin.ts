import { AlertStatus } from '@/utils/consts';
import { Component, Vue } from 'vue-property-decorator';

@Component
export class AlertMixin extends Vue {
  alertMessage = '';
  prevTimeout: number | undefined;
  alertStatus: AlertStatus = 'info';

  showAlert(message: string, alertStatus: AlertStatus = 'info') {
    this.alertStatus = alertStatus;

    if (this.prevTimeout) {
      clearTimeout(this.prevTimeout);
    }

    return new Promise(resolve => {
      this.alertMessage = message;

      this.prevTimeout = setTimeout(() => {
        resolve((this.alertMessage = ''));
      }, 3000);
    });
  }
}
