import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { User } from "./User";

@Entity({ name: "user_addresses" })
export class UserAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (u) => u.addresses, { onDelete: "CASCADE" })
  user!: User;

  @Column({ length: 255 })
  streetName!: string;

  @Column({ length: 255 })
  ward!: string;

  @Column({ length: 255 })
  city!: string;

  @Column({ length: 255 })
  country!: string;

  @Column({ type: "bit", default: false })
  isDefault!: boolean;
}
