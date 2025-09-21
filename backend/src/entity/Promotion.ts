import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "promotions" })
export class Promotion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "datetime2" })
  startAt!: Date;

  @Column({ type: "datetime2" })
  endAt!: Date;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  discountRate!: string;

  @Column({ length: 255, nullable: true })
  code?: string;

  @Column({ length: 255, nullable: true })
  type?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  value?: string;

  @Column({ nullable: true })
  usageLimit?: number;

  @Column({ default: 0 })
  timeUsed!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  minAmount?: string;
}
