import { Component, Vue } from 'vue-property-decorator';
import { AlertStatus } from '@/utils/enums';

@Component
export class AlertMixin extends Vue {
  alertMessage = '';
  alertStatus = AlertStatus.Info;
  prevTimeout: NodeJS.Timeout | undefined;

  showAlert(message: string, alertStatus: AlertStatus = AlertStatus.Info) {
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
