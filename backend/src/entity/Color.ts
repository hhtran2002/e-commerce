import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProductItem } from "./ProductItem";

@Entity({ name: "colors" })
export class Color {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, nullable: true })
  colorCode?: string;

  @OneToMany(() => ProductItem, (pi) => pi.color)
  productItems!: ProductItem[];
}
