import { Product } from '@/types';
import tailwind from '../../tailwind.config';
export const colors: string[] = Object.values(tailwind.theme.colors);

export const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const passwordValidationPatterns = {
  hasNumber: /\d/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasSpecial: /[!"#$%&'()*+,-.<=>?@~^]/,
  isLong: /^.{8,}$/
};

// eslint-disable-next-line max-len
export const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum ErrorCode {
  InvalidEmail = 'auth/invalid-email',
  InvalidPassword = 'auth/invalid-password',
  WrongPassword = 'auth/wrong-password',
  WeakPassword = 'auth/weak-password',
  InvalidDisplayName = 'auth/invalid-display-name',
  UserNotFound = 'auth/user-not-found'
}

export const authErrors = {
  'auth/invalid-email': {
    type: 'email',
    message: 'Please enter a valid email.'
  },
  'auth/invalid-password': {
    type: 'password',
    message: 'Wrong password. Please try again.'
  },
  'auth/wrong-password': {
    type: 'password',
    message: 'Wrong password. Please try again.'
  },
  'auth/weak-password': {
    type: 'password',
    message: 'Password is too weak.'
  },
  'auth/invalid-display-name': {
    type: 'displayName',
    message: 'Please provide a valid name.'
  },
  'auth/user-not-found': {
    message: 'We could not find a user that corresponds to this email. Try signing up.'
  }
};

export enum CallableFunctions {
  GetUsersByEmail = 'getUsersByEmail'
}

export type fridgeAction = 'delete' | 'waste' | 'consume';

export const fridgeActions: {
  [actionName in fridgeAction]: { act: (product: Product) => {}; message: string };
} = {
  delete: {
    act: p => p.delete(),
    message: 'Products were deleted'
  },
  waste: {
    act: p => p.waste(),
    message: 'Products were wasted'
  },
  consume: {
    act: p => p.consume(),
    message: 'Products were consumed'
  }
};
