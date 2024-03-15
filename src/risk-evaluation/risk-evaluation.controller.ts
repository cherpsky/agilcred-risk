import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RiskEvaluationService } from './risk-evaluation.service';

@Controller('risk-evaluation')
export class RiskEvaluationController {
  constructor(private riskEvaluation: RiskEvaluationService) {}

  @Get('users/:userId/requests/:requestId')
  async getRequestRiskApproval(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('requestId', ParseIntPipe) requestId: number,
    @Query('type') type?: string,
  ): Promise<any> {
    if (type === 'short') {
      const res = await this.riskEvaluation.getCreditRequestAssesment(
        userId,
        requestId,
      );

      const rejectedConditions = res.evaluations.filter(
        (evaluation) => !evaluation.approved && !evaluation.stop,
      );

      const approved = res.stops <= 0 && rejectedConditions.length === 0;

      return {
        approved,
        stops: res.stops,
        rejectedConditions,
      };
    }
    return this.riskEvaluation.getCreditRequestAssesment(userId, requestId);
  }
}
