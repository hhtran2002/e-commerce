import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { ProductItem } from "./ProductItem";

@Entity({ name: "cart_items" })
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Cart, (c) => c.items, { nullable: false, onDelete: "CASCADE" })
  cart!: Cart;

  @Column()
  quantity!: number;

  @ManyToOne(() => Product, { nullable: false })
  product!: Product;

  @ManyToOne(() => ProductItem, { nullable: false })
  productItem!: ProductItem;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  priceAt!: string;
}
