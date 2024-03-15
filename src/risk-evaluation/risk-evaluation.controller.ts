import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RiskEvaluationService } from './risk-evaluation.service';

@Controller('risk-evaluation')
export class RiskEvaluationController {
  constructor(private riskEvaluation: RiskEvaluationService) {}

  @Get('users/:userId/requests/:requestId')
  async getRequestRiskApproval(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<any> {
    return this.riskEvaluation.getCreditRequestAssesment(userId, requestId);
  }
}
