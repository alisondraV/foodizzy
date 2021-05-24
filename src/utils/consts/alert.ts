import { AlertColor, AlertStatus } from '@/utils/enums';

export const alertColor: { [status in AlertStatus]: AlertColor } = {
  danger: AlertColor.LightPeach,
  success: AlertColor.LightGreen,
  info: AlertColor.LightYellow
};

export type Alert = {
  message: string;
  status: AlertStatus;
};
