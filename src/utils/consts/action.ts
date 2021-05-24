import { AlertStatus, ShoppingListAction, StorageAction } from '@/utils/enums';
import { Alert } from './alert';
import { Product } from '@/types';

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
      status: AlertStatus.Danger
    }
  },
  waste: {
    act: products => Product.wasteAll(products),
    alert: {
      message: 'Products were wasted',
      status: AlertStatus.Danger
    }
  },
  consume: {
    act: products => Product.consumeAll(products),
    alert: {
      message: 'Products were moved to the shopping list',
      status: AlertStatus.Info
    }
  }
};

export const shoppingListActions: {
  [actionName in ShoppingListAction]: Action;
} = {
  delete: {
    act: products => Product.removeAllFromShoppingList(products),
    alert: {
      message: 'Products were deleted',
      status: AlertStatus.Danger
    }
  },
  purchase: {
    act: products => Product.purchaseAll(products),
    alert: {
      message: 'Products were moved to the storage',
      status: AlertStatus.Info
    }
  }
};
