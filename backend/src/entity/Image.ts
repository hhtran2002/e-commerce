import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProductItem } from "./ProductItem";

@Entity({ name: "images" })
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  imageUrl!: string;

  @OneToMany(() => ProductItem, (pi) => pi.image)
  productItems!: ProductItem[];
}
