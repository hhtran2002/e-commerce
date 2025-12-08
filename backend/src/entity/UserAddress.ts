import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "user_addresses" })
export class UserAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  streetName!: string;

  @Column({ length: 255 })
  @Column({ length: 255, nullable: true })
  ward?: string;

  @Column({ length: 255 })
  city!: string;

  @Column({ length: 255 })
  country!: string;

  @ManyToOne(() => User, (u) => u.addresses, { nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;
}
