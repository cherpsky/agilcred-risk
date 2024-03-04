import { ApplicantRequest, ApplicantResponse } from '@interfaces/index';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogServiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  agilcredonlineId: number;

  @Column({ type: 'bigint', unsigned: true })
  usersId: number;

  @Column({ type: 'bigint', unsigned: true })
  solicitudesId: number;

  @Column({ type: 'varchar', length: 100 })
  service: string;

  @Column({ type: 'varchar', length: 100 })
  uri: string;

  @Column({ type: 'varchar', length: 20 })
  method: string;

  @Column({ type: 'int', unsigned: true })
  statusCode: number;

  @Column({ type: 'json' })
  request: ApplicantRequest;

  @Column({ type: 'json' })
  response: ApplicantResponse;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'int', unsigned: true })
  duration: number;

  @Column({ type: 'tinyint', unsigned: true })
  informed: number;
}
