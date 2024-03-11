import { ApplicantRequest, RootResponse } from '@interfaces/index';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log_service')
export class LogServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  users_id: number;

  @Column({ type: 'bigint', unsigned: true })
  solicitudes_id: number;

  @Column({ type: 'varchar', length: 100 })
  service: string;

  @Column({ type: 'varchar', length: 100 })
  uri: string;

  @Column({ type: 'varchar', length: 20 })
  method: string;

  @Column({ type: 'int', unsigned: true })
  status_code: number;

  @Column({ type: 'json' })
  request: ApplicantRequest;

  @Column({ type: 'json' })
  response: RootResponse;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'int', unsigned: true })
  duration: number;

  @Column({ type: 'tinyint', unsigned: true })
  informed: number;
}
