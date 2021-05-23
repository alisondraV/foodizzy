export { navigationOptions } from './navigationOptions';
export { IconName, Icons } from './icons';

import { Product } from '@/types';
import tailwind from '../../../tailwind.config';
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
  hasLowerCase: /[a-z]/,
  isLong: /^.{8,}$/
};

// eslint-disable-next-line max-len
export const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

export type Color = 'light-peach' | 'light-green' | 'light-yellow';
export type AlertStatus = 'danger' | 'success' | 'info';
export const alertColor: { [status in AlertStatus]: Color } = {
  danger: 'light-peach',
  success: 'light-green',
  info: 'light-yellow'
};

export type ListName = 'storage' | 'shoppingList';

export type StorageAction = 'delete' | 'waste' | 'consume';

export type Alert = {
  message: string;
  status: AlertStatus;
};

export type Action = {
  act: (products: Product[]) => Promise<void> | void;
  alert: Alert;
};

export const storageActions: {
  [actionName in StorageAction]: Action;
} = {
  delete: {
    act: products => Product.removeAllFromStorage(products),
    alert: {
      message: 'Products were deleted',
      status: 'danger'
    }
  },
  waste: {
    act: products => Product.wasteAll(products),
    alert: {
      message: 'Products were wasted',
      status: 'danger'
    }
  },
  consume: {
    act: products => Product.consumeAll(products),
    alert: {
      message: 'Products were moved to the shopping list',
      status: 'info'
    }
  }
};

export type ShoppingListAction = 'delete' | 'purchase';

export const shoppingListActions: {
  [actionName in ShoppingListAction]: Action;
} = {
  delete: {
    act: products => Product.removeAllFromShoppingList(products),
    alert: {
      message: 'Products were deleted',
      status: 'danger'
    }
  },
  purchase: {
    act: products => Product.purchaseAll(products),
    alert: {
      message: 'Products were moved to the storage',
      status: 'info'
    }
  }
};

export const pages = {
  storage: {
    default: require('@/assets/images/Empty.svg'),
    selected: require('@/assets/images/Check.svg')
  },
  newProduct: {
    default: require('@/assets/images/PlusIcon.svg'),
    selected: require('@/assets/images/Minus.svg')
  },
  shoppingList: {
    default: require('@/assets/images/Empty.svg'),
    selected: require('@/assets/images/Check.svg')
  }
};
