import { Alert } from './alert';
import { Product } from '@/types';

export type StorageAction = 'delete' | 'waste' | 'consume';

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
