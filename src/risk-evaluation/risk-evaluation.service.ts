import { Injectable, NotFoundException } from '@nestjs/common';
import { finalRiskAssessment } from 'risk-functions/risk-functions';
import { LogService } from 'services/log.service';
import { SolicitudService } from 'services/solicitud.service';

@Injectable()
export class RiskEvaluationService {
  constructor(
    private logService: LogService,
    private solicitud: SolicitudService,
  ) {}

  async getCreditRequestAssesment(userId: number, solicitudesId: number) {
    const log = await this.logService.getLatestOpenBankingLogByUserId(
      userId,
      solicitudesId,
    );

    const solicitud = await this.solicitud.getSolicitudById(solicitudesId);
    if (log && solicitud) {
      log.response.importe_total = Number(solicitud.importe_total);
      return finalRiskAssessment(log.response);
    } else
      throw new NotFoundException({
        message: "Record wasn't found",
        code: 404,
      });
  }
}
