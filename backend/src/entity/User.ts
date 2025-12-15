import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Role } from "./Role";
import { UserAddress } from "./UserAddress";
import { Order } from "./Order";
import { Cart } from "./Cart";
import { Review } from "./Review";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  userName!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  hashPassword!: string;

  @Column({ length: 15, unique: true })
  phone!: string;

  @Column({ length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ length: 255 })
  fullName!: string;

  @Column({ length: 255, nullable: true })
  keycloakId?: string;

  @Column({ nullable: true, type: "varchar", length: 255 })
  resetToken?: string | null;

  @Column({ type: "datetime2", nullable: true })
  resetTokenExpiry?: Date | null;

  @ManyToOne(() => Role, (r) => r.users, { nullable: false })
  role!: Role;

  @OneToMany(() => UserAddress, (a) => a.user)
  addresses!: UserAddress[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updateAt?: Date;

  @OneToMany(() => Order, (o) => o.user)
  orders!: Order[];

  @OneToMany(() => Cart, (c) => c.user)
  carts!: Cart[];

  @OneToMany(() => Review, (r) => r.user)
  reviews!: Review[];
}