import { Component, Vue } from "vue-property-decorator";

@Component
export class AlertMixin extends Vue {
  alertMessage = "";

  showAlert(message: string) {
    return new Promise(resolve => {
      this.alertMessage = message;

      setTimeout(() => {
        resolve((this.alertMessage = ""));
      }, 3000);
    });
  }
}
