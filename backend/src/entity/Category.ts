import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Product } from "./Product";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @ManyToOne(() => Category, (c) => c.children, { nullable: true })
  parent?: Category;

  @OneToMany(() => Category, (c) => c.parent)
  children!: Category[];

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @OneToMany(() => Product, (p) => p.category)
  products!: Product[];
}
