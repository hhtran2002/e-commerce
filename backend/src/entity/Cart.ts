import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity({ name: "carts" })
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.carts, { nullable: false })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updateAt?: Date;

  @OneToMany(() => CartItem, (ci) => ci.cart)
  items!: CartItem[];
}
