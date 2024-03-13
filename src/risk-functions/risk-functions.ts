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
  evaluation: string;
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
  evaluation?: string,
): EvaluationItem {
  return { riskFunctionName: func.name, approved, value, evaluation };
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

  const approved = !['1', '2', '3', ''].includes(calificacionHibrido); //TODO check for numerical values

  input.evaluations.push(
    addEvaluation(
      RC001RiskScoreOB,
      approved,
      calificacionHibrido,
      'Rejected if value in 1, 2, 3 or empty string',
    ),
  );
  return input;
}

export function RC002DebtOtherThanTelco(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const present =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.present;
  const totalUnpaidBalance =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.totalUnpaidBalance;
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved = !(
    present === '00' && totalUnpaidBalance - unpaidBalanceOfTelco > 0
  );

  input.evaluations.push(
    addEvaluation(
      RC002DebtOtherThanTelco,
      approved,
      {
        present:
          input.openBankingResponse.applicants.primaryConsumer
            .dataSourceResponses.EIPG.RISK.present,
        totalUnpaidBalance,
        unpaidBalanceOfTelco,
      },
      'if present is equals to 00 and totalUnpaidBalance - unpaidBalanceOfTelco > 0 its rejected',
    ),
  );
  return input;
}

export function RC003TelcoDebt(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const present =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.present; //Banking reports
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved = !(present === '00' && unpaidBalanceOfTelco > 80); //TODO check for numeric values

  input.evaluations.push(
    addEvaluation(
      RC003TelcoDebt,
      approved,
      {
        present:
          input.openBankingResponse.applicants.primaryConsumer
            .dataSourceResponses.EIPG.RISK.present,
        unpaidBalanceOfTelco,
      },
      '',
    ),
  );
  return input;
}

export function RC004DaysOfWorstSituation(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const numberOfDaysOfWorstSituation =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.numberOfDaysOfWorstSituation;
  const approved = numberOfDaysOfWorstSituation < 60;
  input.evaluations.push(
    addEvaluation(RC004DaysOfWorstSituation, approved, {
      numberOfDaysOfWorstSituation,
      minDays: 60,
    }),
  );
  return input;
}

export function RC005MonthsAvailable(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const totalWholeMonthsOfTransactions =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalWholeMonthsOfTransactions;

  const approved = totalWholeMonthsOfTransactions >= 6;

  input.evaluations.push(
    addEvaluation(RC005MonthsAvailable, approved, {
      totalWholeMonthsOfTransactions,
      months: 6,
    }),
  );
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
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalWholeMonthsOfTransactions;

  const approved = daysOfTrns / totalWholeMonthsOfTransactions >= 10;
  input.evaluations.push(
    addEvaluation(RC006MonthlyTransactions, approved, {
      daysOfTrns,
      totalWholeMonthsOfTransactions,
      transactionsMedia: 10,
    }),
  );
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

  const loanQuota = 0; //TODO Importe total (más intereses)

  const approved =
    totalCashFlowIncoming6M * numAccounts -
      totalCashFlowOutcoming6M * numAccounts +
      loanQuota >=
    50;

  input.evaluations.push(
    addEvaluation(RC007CashflowPaymentCapacity, approved, {
      totalCashFlowIncoming6M,
      totalCashFlowOutcoming6M,
      numAccounts,
      amount: 50,
    }),
  );
  return input;
}

export function RC008LastBalance(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const lastBalance =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.balances
      .lastBalance;

  const approved = lastBalance >= 0;
  input.evaluations.push(
    addEvaluation(RC008LastBalance, approved, { lastBalance, amount: 0 }),
  );
  return input;
}

export function RC009IncomeVerification(
  input: RiskAssesmentUnit,
): RiskAssesmentUnit {
  const meanTimeBetweenPayments =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.incomeVerification.primaryIncome
      .meanTimeBetweenPayments;

  const approved = meanTimeBetweenPayments > 15 && meanTimeBetweenPayments < 40; //Semáforo

  input.evaluations.push(
    addEvaluation(RC009IncomeVerification, approved, {
      meanTimeBetweenPayments,
    }),
  );
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

  const firstCondition = numDaysInOverdraft1M / (numDaysInOverdraft6M / 6) > 2;
  const secondCondition = numDaysInOverdraft1M > 6;

  const approved = !(firstCondition && secondCondition);

  input.evaluations.push(
    addEvaluation(RC010MinimumBalances, approved, {
      numDaysInOverdraft1M,
      numDaysInOverdraft6M,
    }),
  );

  return input;
}

export function RC011(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const sumLoans1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans1M;
  const sumLoans6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans6M;
  const sumLoans12M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans12M;

  const firstCondition = sumLoans1M >= sumLoans6M;
  const secondCondition = sumLoans1M >= sumLoans12M;

  const approved = !(firstCondition || secondCondition);

  input.evaluations.push(
    addEvaluation(RC011, approved, { sumLoans1M, sumLoans6M, sumLoans12M }),
  );
  return input;
}

export function RC012(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const sumLoans1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans1M;

  const approved = sumLoans1M <= 2;
  input.evaluations.push(addEvaluation(RC012, approved, { sumLoans1M }));
  return input;
}

export function RC013(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalCashFlowIncoming1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming1M;

  const numAccounts =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.accountOverview
      .numAccounts;
  const totalCashFlowOutcoming1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming1M;

  const loanFee = 500; //TODO read from actual load, importe_total.

  const approved = !(
    totalCashFlowIncoming1M * numAccounts -
      totalCashFlowOutcoming1M * numAccounts +
      loanFee <
    50
  );

  input.evaluations.push(
    addEvaluation(RC013, approved, {
      totalCashFlowIncoming1M,
      numAccounts,
      totalCashFlowOutcoming6M: totalCashFlowOutcoming1M,
    }),
  );
  return input;
}

export function RC014PaydayLoan(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalCashFlowIncoming6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming6M;
  const totalCashFlowIncoming5M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming5M;

  const totalCashFlowIncoming4M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming4M;

  const totalCashFlowIncoming1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport.totalCashFlowIncoming1M;

  const totalCashFlowOutcoming6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming6M;
  const totalCashFlowOutcoming5M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming5M;

  const totalCashFlowOutcoming4M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming4M;

  const totalAverageCashFlowIncoming3M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalAverageCashFlowIncoming3M;

  const totalAverageCashFlowOutcoming3M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalAverageCashFlowOutcoming3M;

  const totalCashFlowOutcoming1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalCashFlowOutcoming1M;

  const numAccounts =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.accountOverview
      .numAccounts;

  const loanFee = 0; //TODO importe_total;

  const a =
    (totalCashFlowIncoming6M +
      totalCashFlowIncoming4M +
      totalCashFlowIncoming5M -
      totalCashFlowOutcoming6M -
      totalCashFlowOutcoming5M -
      totalCashFlowOutcoming4M) /
    3;

  const b =
    totalAverageCashFlowIncoming3M -
    totalAverageCashFlowOutcoming3M * numAccounts;

  const approved =
    a < b &&
    totalCashFlowIncoming1M - totalCashFlowOutcoming1M - loanFee > 50 * (a / b);

  input.evaluations.push(
    addEvaluation(RC014PaydayLoan, approved, {
      totalCashFlowIncoming6M,
      totalCashFlowIncoming5M,
      totalCashFlowIncoming4M,
      totalCashFlowIncoming1M,
      totalCashFlowOutcoming6M,
      totalCashFlowOutcoming5M,
      totalCashFlowOutcoming4M,
      totalAverageCashFlowIncoming3M,
      totalAverageCashFlowOutcoming3M,
      totalCashFlowOutcoming1M,
      numAccounts,
      loanFee,
      a,
      b,
    }),
  );

  return input;
}
