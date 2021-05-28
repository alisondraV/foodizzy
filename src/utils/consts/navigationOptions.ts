import { Icons } from './icons';

type NavigationOption = {
  pathName: string;
  icon: string;
};

export const navigationOptions: NavigationOption[] = [
  {
    pathName: '/',
    icon: Icons.Statistics
  },
  {
    pathName: '/storage',
    icon: Icons.Storage
  },
  {
    pathName: '/shopping-list',
    icon: Icons.ShoppingList
  },
  {
    pathName: '/recipes',
    icon: Icons.Recipes
  }
];
