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
    const assesment = await this.riskEvaluation.getCreditRequestAssesment(
      userId,
      requestId,
    );
    const rejectedConditions = assesment.evaluations.filter(
      (evaluation) => !evaluation.approved && !evaluation.stop,
    );

    const stopConditions = assesment.evaluations.filter(
      (evaluation) => evaluation.stop === true,
    );

    const approved = assesment.stops <= 2 && rejectedConditions.length === 0;

    if (type === 'agil') {
      return {
        status: 'ok',
        data: null,
        result: approved ? 'approved' : 'rejected',
        next_step: null,
      };
    } else if (type === 'short') {
      return {
        approved,
        stops: assesment.stops,
        rejectedConditions,
        stopConditions,
      };
    }
    return assesment;
  }
}
