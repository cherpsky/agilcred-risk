import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from 'data/entities/remote/solicitud.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
  ) {}

  getSolicitudById(id: number): Promise<Solicitud> {
    return this.solicitudRepository.findOne({ where: { id } });
  }
}
