import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./CBMessage";

@Entity({ name: "conversations" })
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @Column({ type: "datetime2" })
  startAt!: Date;

  @Column({ type: "datetime2", nullable: true })
  endAt?: Date;

  @Column({ length: 255, nullable: true })
  status?: string;

  @OneToMany(() => Message, (m) => m.conversation)
  messages!: Message[];
}
