import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "shipping_methods" })
export class ShippingMethod {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: string;

  @Column({ length: 255, nullable: true })
  code?: string;

  @Column({ length: 255, nullable: true })
  status?: string;

  @Column({ type: "datetime2", nullable: true })
  shippedDate?: Date;

  @Column({ type: "datetime2", nullable: true })
  deliveredDate?: Date;
}
