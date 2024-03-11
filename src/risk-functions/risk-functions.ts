import { RootResponse } from '@interfaces/index';

export interface RiskAssesmentUnit {
  stops: number;
  evaluations: EvaluationItem[];
  openBankingResponse: RootResponse;
}

export interface EvaluationItem {
  riskFunctionName: string;
  approved: boolean;
  value: any;
}

export const startRiskAssesment = (
  openBankingResponse: RootResponse,
): RiskAssesmentUnit => ({
  stops: 0,
  evaluations: [],
  openBankingResponse,
});

export const finalRiskAssessment = pipeWithStart(
  startRiskAssesment,
  RC001RiskScoreOB,
  RC002DebtOtherThanTelco,
  RC003TelcoDebt,
  RC004DaysOfWorstSituation,
  RC006MonthlyTransactions,
  RC007CashflowPaymentCapacity,
  RC008LastBalance,
  RC009IncomeVerification,
  RC010MinimumBalances,
  RC014PaydayLoan,
);

export function pipeWithStart(
  startFunction: (openBankingResponse: RootResponse) => RiskAssesmentUnit,
  ...funcs: ((input: RiskAssesmentUnit) => RiskAssesmentUnit)[]
): (openBankingResponse: RootResponse) => RiskAssesmentUnit {
  return (openBankingResponse: RootResponse) =>
    funcs.reduce(
      (currentInput, currentFunction) => currentFunction(currentInput),
      startFunction(openBankingResponse),
    );
}

function addEvaluation(
  func: (rau: RiskAssesmentUnit) => RiskAssesmentUnit,
  approved: boolean,
  value: any,
): EvaluationItem {
  return { riskFunctionName: func.name, approved, value };
}

export function riskPipe(
  ...funcs: ((input: RiskAssesmentUnit) => RiskAssesmentUnit)[]
): (input: RiskAssesmentUnit) => RiskAssesmentUnit {
  return (input: RiskAssesmentUnit) =>
    funcs.reduce(
      (currentInput, currentFunction) => currentFunction(currentInput),
      input,
    );
}

export function RC001RiskScoreOB(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const calificacionHibrido =
    input.openBankingResponse.applicants.primaryConsumer.output
      .CalificacionHibrido;
  const approved = ['1', '2', '3'].includes(calificacionHibrido);
  input.evaluations.push(
    addEvaluation(RC001RiskScoreOB, approved, calificacionHibrido),
  );
  return input;
}

export function RC002DebtOtherThanTelco(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const totalUnpaidBalance =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.totalUnpaidBalance;
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.present === '00' &&
    totalUnpaidBalance - unpaidBalanceOfTelco > 0;
  input.evaluations.push(
    addEvaluation(RC002DebtOtherThanTelco, approved, {
      present:
        input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
          .EIPG.RISK.present,
      totalUnpaidBalance,
      unpaidBalanceOfTelco,
    }),
  );
  return input;
}

export function RC003TelcoDebt(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.present === '00' && unpaidBalanceOfTelco > 80;
  input.evaluations.push(
    addEvaluation(RC003TelcoDebt, approved, {
      present:
        input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
          .EIPG.RISK.present,
      unpaidBalanceOfTelco,
    }),
  );
  return input;
}

export function RC004DaysOfWorstSituation(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const numberOfDaysOfWorstSituation =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.numberOfDaysOfWorstSituation;
  if (numberOfDaysOfWorstSituation < 60) {
    input.stops += 1;
  }
  return input;
}

export function RC006MonthlyTransactions(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const daysOfTrns =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.accountActivity
      .daysOfTrns;
  const totalWholeMonthsOfTransactions =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses.BANKINGREPORTS.BANKINGREPORTS.Report.accountReportList.reduce(
      (acc, curr) => acc + curr.wholeMonthsAvailable,
      0,
    );
  if (daysOfTrns / totalWholeMonthsOfTransactions < 10) {
    input.stops += 1;
  }
  return input;
}

export function RC007CashflowPaymentCapacity(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const totalCashFlowIncoming6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming6M;
  const totalCashFlowOutcoming6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming6M;
  const numAccounts =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.accountOverview
      .numAccounts;
  const loanQuota = 0;
  const netCashFlow =
    (totalCashFlowIncoming6M - totalCashFlowOutcoming6M - loanQuota) /
    numAccounts;
  if (netCashFlow < 50) {
    input.stops += 1;
  }
  return input;
}

export function RC008LastBalance(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const lastBalance = 0;
  if (lastBalance < 0) {
    input.stops += 1;
  }
  return input;
}

export function RC009IncomeVerification(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const meanTimeBetweenPayments =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.incomeVerification.primaryIncome
      .meanTimeBetweenPayments;
  if (meanTimeBetweenPayments === 0) {
    input.stops += 1;
  }
  return input;
}

export function RC010MinimumBalances(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const numDaysInOverdraft1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.overdrafts
      .numDaysInOverdraft1M;
  const numDaysInOverdraft6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.overdrafts
      .numDaysInOverdraft6M;
  const SumLoans6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans6M;
  const SumLoans12M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans12M;
  const overdraftRatio = numDaysInOverdraft1M / numDaysInOverdraft6M;
  const loanGrowth = SumLoans6M >= SumLoans12M;

  if (overdraftRatio > 2 || numDaysInOverdraft1M > 6 || loanGrowth) {
    input.stops += 1;
  }
  return input;
}

export function RC014PaydayLoan(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalCashFlowIncoming1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming6M;
  const totalCashFlowOutcoming6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming6M;
  const numAccounts =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.accountOverview
      .numAccounts;
  const loanQuota = 0;
  const netCashFlow =
    (totalCashFlowIncoming1M - totalCashFlowOutcoming6M - loanQuota) /
    numAccounts;
  if (netCashFlow < 50) {
    input.stops += 1;
  }
  return input;
}
