import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Conversation } from "./CBConversation";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Conversation, (c) => c.messages, { nullable: false, onDelete: "CASCADE" })
  conversation!: Conversation;

  // senderId có thể là user nội bộ khác; lưu như số đơn giản
  @Column()
  senderId!: number;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "datetime2" })
  createdAt!: Date;
}
