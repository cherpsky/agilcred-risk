import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogServiceEntity } from 'data/entities/remote/log-service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogServiceEntity)
    private logRepository: Repository<LogServiceEntity>,
  ) {}

  public getLogs(): Promise<LogServiceEntity[]> {
    return this.logRepository.find();
  }

  public getOpenBankingLogsByUserId(
    users_id: number,
  ): Promise<LogServiceEntity[]> {
    return this.logRepository.find({
      where: { users_id, service: 'openbanking' },
    });
  }

  public getLatestOpenBankingLogByUserId(
    users_id: number,
    solicitudes_id: number,
  ): Promise<LogServiceEntity | null> {
    return this.logRepository.findOne({
      where: { users_id, service: 'openbanking', solicitudes_id },
    });
  }
}
