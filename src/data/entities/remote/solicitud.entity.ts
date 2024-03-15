import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('solicitudes')
export class Solicitud {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  users_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  empleo_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  motivo_prestamo_id: number;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  importe: string;

  @Column({ type: 'decimal', precision: 25, scale: 2, nullable: true })
  importe_total: string;

  @Column({ type: 'decimal', precision: 20, scale: 2, nullable: true })
  interes: string;

  @Column({ type: 'decimal', precision: 25, scale: 2, nullable: true })
  ingresos_mensuales: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  iban: string;

  @Column({ type: 'date', nullable: true })
  fecha_acreditacion_haberes: string;

  @Column({ type: 'date', nullable: true })
  fecha_devolucion: string;

  @Column({ type: 'datetime', nullable: true })
  fecha_creacion: Date;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  acepta_terminos_condiciones: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({
    type: 'enum',
    enum: ['iniciada', 'preliquidada', 'liquidada', 'pagada'],
    default: 'iniciada',
  })
  estado: 'iniciada' | 'preliquidada' | 'liquidada' | 'pagada';
}
