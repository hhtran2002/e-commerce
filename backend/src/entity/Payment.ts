import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";

@Entity({ name: "payments" })
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  method!: string;

  @OneToOne(() => Order, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  order?: Order;

  @Column({ length: 255, nullable: true })
  status?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  amount?: string;

  @Column({ length: 255, nullable: true })
  code?: string;

  @Column({ type: "datetime2", nullable: true })
  paidAt?: Date;
}
