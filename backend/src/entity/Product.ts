import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm";
import { Category } from "./Category";
import { Size } from "./Size";
import { Color } from "./Color";
import { Image } from "./Image";
import { Review } from "./Review";
import { ProductItem } from "./ProductItem";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  brand?: string;

  @ManyToOne(() => Category, (c) => c.products, { nullable: false })
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updateAt?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: string;

  @Column()
  stockQuantity!: number;

  // Các khóa ngoại đơn (theo mô tả)
  @ManyToOne(() => Size, (s) => s.products, { nullable: true })
  size?: Size;

  @ManyToOne(() => Color, (c) => c.products, { nullable: true })
  color?: Color;

  @ManyToOne(() => Image, (i) => i.products, { nullable: true })
  image?: Image;

  @OneToMany(() => Review, (r) => r.product)
  reviews!: Review[];

  @OneToMany(() => ProductItem, (pi) => pi.product)
  items!: ProductItem[];
}
