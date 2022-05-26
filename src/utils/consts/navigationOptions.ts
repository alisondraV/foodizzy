import { Icons } from './icons';
import { PathName } from '@/utils/enums';

type NavigationOption = {
  pathName: string;
  icon: string;
};

export const navigationOptions: NavigationOption[] = [
  {
    pathName: PathName.Storage,
    icon: Icons.Storage
  },
  {
    pathName: PathName.ShoppingList,
    icon: Icons.ShoppingList
  },
  {
    pathName: PathName.Statistics,
    icon: Icons.Statistics
  },
  {
    pathName: PathName.Recipes,
    icon: Icons.Recipes
  }
];
