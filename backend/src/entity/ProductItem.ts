import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Size } from "./Size";
import { Image } from "./Image";
import { Color } from "./Color";

@Entity({ name: "product_items" })
export class ProductItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: string;

  @ManyToOne(() => Product, (p) => p.items, { nullable: false, onDelete: "CASCADE" })
  product!: Product;

  @ManyToOne(() => Size, (s) => s.productItems, { nullable: true })
  size?: Size;

  @ManyToOne(() => Image, (i) => i.productItems, { nullable: true })
  image?: Image;

  @ManyToOne(() => Color, (c) => c.productItems, { nullable: true })
  color?: Color;
}
