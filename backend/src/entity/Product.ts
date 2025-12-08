import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from "typeorm";
import { Category } from "./Category";
import { Review } from "./Review";
import { ProductItem } from "./ProductItem";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

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

  @OneToMany(() => Review, (r) => r.product)
  reviews!: Review[];

  @OneToMany(() => ProductItem, (pi) => pi.product)
  items!: ProductItem[];
}
