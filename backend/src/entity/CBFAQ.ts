import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "faqs" })
export class FAQ {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  question!: string;

  @Column({ type: "text" })
  answer!: string;

  @Column({ length: 255, nullable: true })
  tags?: string;
}
