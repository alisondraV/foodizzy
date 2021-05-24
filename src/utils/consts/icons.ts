import { IconName } from '@/utils/enums';

export const Icons: { [iconName in IconName]: string } = {
  AddNew: require('@/assets/images/AddNew.svg'),
  Remove: require('@/assets/images/Cross.svg'),
  RemoveFAB: require('@/assets/images/RemoveFAB.svg'),
  Waste: require('@/assets/images/Waste.svg'),
  WasteFAB: require('@/assets/images/WasteFAB.svg'),
  MoveToShoppingList: require('@/assets/images/MoveToShoppingListFAB.svg'),
  Purchase: require('@/assets/images/PurchaseFAB.svg'),
  TakePhoto: require('@/assets/images/TakePhoto.svg'),
  Statistics: require('@/assets/images/Statistics.svg'),
  Storage: require('@/assets/images/Storage.svg'),
  ShoppingList: require('@/assets/images/ShoppingList.svg'),
  Recipes: require('@/assets/images/Recipes.svg')
};
