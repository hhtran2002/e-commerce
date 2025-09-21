import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.orders, { nullable: false })
  user!: User;

  @Column({ length: 255 })
  shippingAddress!: string;

  @Column({ length: 20 })
  status!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @OneToMany(() => OrderItem, (oi) => oi.order)
  items!: OrderItem[];
}
