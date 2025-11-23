import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product";
import { ProductItem } from "./ProductItem";

@Entity({ name: "sizes" })
export class Size {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => ProductItem, (pi) => pi.size)
  productItems!: ProductItem[];
}
