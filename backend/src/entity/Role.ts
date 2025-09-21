import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => User, (u) => u.role)
  users!: User[];
}
