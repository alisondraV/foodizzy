import Product from "./Product";

export default interface WastedProduct extends Product {
  dateWasted: Date;
}
