import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";

@Entity({ name: "user_addresses" })
export class UserAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  streetName!: string;

  @Column({ length: 255 })
  ward!: string;

  @Column({ length: 255 })
  city!: string;

  @Column({ length: 255 })
  country!: string;

}
