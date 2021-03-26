import { ProductDTO } from '@/types/DTOs';

export default interface ShoppingListItem extends ProductDTO {
  acquired: boolean;
}
