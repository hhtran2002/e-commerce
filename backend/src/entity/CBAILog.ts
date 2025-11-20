import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "ai_logs" })
export class AILog {
  @PrimaryGeneratedColumn()
  id!: number;


  @Column({ length: 255 })
  conversationId!: string;

  @Column({ type: "text" })
  prompt!: string;

  @Column({ type: "text", nullable: true })
  response?: string;

  @Column()
  tokenUsed!: number;

  @Column({ type: "datetime2" })
  createdAt!: Date;
}
