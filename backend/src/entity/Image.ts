import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { ProductItem } from "./ProductItem";

@Entity({ name: "images" })
export class Image {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  imageUrl!: string;

  @ManyToOne(() => ProductItem, (pi) => pi.images, { onDelete: "CASCADE" })
  productItem!: ProductItem;
}
