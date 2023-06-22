import { ref } from 'vue';
import { AlertStatus } from '@/utils/enums';

export const useAlert = () => {
  const alertMessage = ref('');
  const alertStatus = ref(AlertStatus.Info);
  const prevTimeout = ref<NodeJS.Timeout>();

  function showAlert(message: string, status: AlertStatus = AlertStatus.Info) {
    alertStatus.value = status;

    if (prevTimeout.value) {
      clearTimeout(prevTimeout.value);
    }

    return new Promise(resolve => {
      alertMessage.value = message;

      prevTimeout.value = setTimeout(() => {
        resolve((alertMessage.value = ''));
      }, 3000);
    });
  }

  return { showAlert, alertMessage, alertStatus };
};
