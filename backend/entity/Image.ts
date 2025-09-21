import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";
import { ProductItem } from "./ProductItem";

@Entity({ name: "images" })
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  imageUrl!: string;

  @OneToMany(() => Product, (p) => p.image)
  products!: Product[];

  @OneToMany(() => ProductItem, (pi) => pi.image)
  productItems!: ProductItem[];
}
