import { Color } from './colors';

export type AlertStatus = 'danger' | 'success' | 'info';

export const alertColor: { [status in AlertStatus]: Color } = {
  danger: 'light-peach',
  success: 'light-green',
  info: 'light-yellow'
};

export type Alert = {
  message: string;
  status: AlertStatus;
};
