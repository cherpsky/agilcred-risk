import { Injectable } from '@nestjs/common';
import { finalRiskAssessment } from 'risk-functions/risk-functions';
import { LogService } from 'services/log.service';

@Injectable()
export class RiskEvaluationService {
  constructor(private logService: LogService) {}

  async getCreditRequestAssesment(userId: number, solicitudesId: number) {
    const log = await this.logService.getLatestOpenBankingLogByUserId(
      userId,
      solicitudesId,
    );

    if (log) return finalRiskAssessment(log.response);
    return null;
  }
}
