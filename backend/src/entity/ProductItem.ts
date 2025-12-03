import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./Product";
import { Size } from "./Size";
import { Image } from "./Image";
import { Color } from "./Color";

@Entity({ name: "product_items" })
export class ProductItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (p) => p.items, { nullable: false, onDelete: "CASCADE" })
  product!: Product;

  @ManyToOne(() => Size, (s) => s.productItems, { nullable: true })
  size?: Size;

  @OneToMany(() => Image, (image) => image.productItem)
  images!: Image[];

  @ManyToOne(() => Color, (c) => c.productItems, { nullable: true })
  color?: Color;
}
