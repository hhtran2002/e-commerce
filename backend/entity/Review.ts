import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity({ name: "reviews" })
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 3, scale: 2 })
  rate!: string;

  @Column({ type: "datetime2" })
  createAt!: Date;

  @ManyToOne(() => User, (u) => u.reviews, { nullable: false })
  user!: User;

  @Column({ type: "text", nullable: true })
  comment?: string;

  @ManyToOne(() => Product, (p) => p.reviews, { nullable: false })
  product!: Product;
}
