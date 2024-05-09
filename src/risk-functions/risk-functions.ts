import { RootResponse } from '@interfaces/index';

export interface RiskAssesmentUnit {
  stops: number;
  evaluations: EvaluationItem[];
  openBankingResponse: RootResponse;
}

export interface EvaluationItem {
  riskFunctionName: string;
  approved: boolean;
  stop: boolean;
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
  Rule00,
  Rule01,
  Rule02,
  Rule03,
  Rule04,
  Rule05,
  Rule06,
  Rule07,
  Rule08,
  Rule09,
  Rule10,
  Rule11,
  StopsRule,
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
  stop?: boolean,
): EvaluationItem {
  return {
    riskFunctionName: func.name,
    approved,
    value,
    evaluation,
    stop: stop === true,
  };
}

export function StopsRule(input: RiskAssesmentUnit): RiskAssesmentUnit {
  input.stops = input.evaluations.filter(
    (evaluation) => evaluation.stop === true,
  ).length;
  return input;
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

export function Rule00(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const present =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.present;
  const approved = !(present === '00');

  input.evaluations.push(
    addEvaluation(
      Rule00,
      approved,
      {
        present,
      },
      'Approved if present !== 00',
    ),
  );
  return input;
}

export function Rule01(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const avg3m =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.incomeVerification.primaryIncome
      .avg3m;

  const approved = avg3m >= 1000;

  input.evaluations.push(
    addEvaluation(
      Rule01,
      approved,
      {
        avg3m,
      },
      'Approved if avg3m >= 1000',
    ),
  );
  return input;
}

export function Rule02(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalUnpaidBalance =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.totalUnpaidBalance;
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved = totalUnpaidBalance - unpaidBalanceOfTelco <= 80;

  input.evaluations.push(
    addEvaluation(
      Rule02,
      approved,
      {
        unpaidBalanceOfTelco,
        totalUnpaidBalance,
        value: 80,
      },
      'approved = totalUnpaidBalance - unpaidBalanceOfTelco <= 80',
    ),
  );
  return input;
}

export function Rule03(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const unpaidBalanceOfTelco =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.unpaidBalanceOfTelco;

  const approved = unpaidBalanceOfTelco <= 80;
  input.evaluations.push(
    addEvaluation(
      Rule00,
      approved,
      {
        unpaidBalanceOfTelco,
      },
      'Approved if unpaidBalanceOfTelco <= 80',
    ),
  );
  return input;
}

export function Rule04(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const numberOfDaysOfWorstSituation =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .EIPG.RISK.araAttributes.numberOfDaysOfWorstSituation;
  const approved = numberOfDaysOfWorstSituation < 10;
  input.evaluations.push(
    addEvaluation(
      Rule04,
      approved,
      {
        numberOfDaysOfWorstSituation,
        minDays: 10,
      },
      'approved if numberOfDaysOfWorstSituation < 10',
    ),
  );
  return input;
}

export function Rule05(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalWholeMonthsOfTransactions =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalWholeMonthsOfTransactions;

  const approved = totalWholeMonthsOfTransactions >= 3;

  input.evaluations.push(
    addEvaluation(
      Rule05,
      approved,
      {
        totalWholeMonthsOfTransactions,
        months: 3,
      },
      'approved if totalWholeMonthsOfTransactions >= 3',
    ),
  );
  return input;
}

export function Rule06(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const lastBalance =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.balances
      .lastBalance;

  const numDaysInOverdraft1W =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.overdrafts
      .numDaysInOverdraft1W;

  const approved = lastBalance >= 0 || numDaysInOverdraft1W <= 4;

  input.evaluations.push(
    addEvaluation(
      Rule06,
      approved,
      {
        lastBalance,
        numDaysInOverdraft1W,
        balance: 0,
        overdraft: 4,
      },
      'approved if lastBalance >= 0 || numDaysInOverdraft1W <= 4',
    ),
  );
  return input;
}

export function Rule07(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const accountReportList =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.accountReportList;
  const averageNumberOfTransactionsWholeMonth = accountReportList.reduce(
    (max, current) => {
      return current.averageNumberOfTransactionsWholeMonth >
        max.averageNumberOfTransactionsWholeMonth
        ? current
        : max;
    },
    accountReportList[0],
  ).averageNumberOfTransactionsWholeMonth;

  const approved = averageNumberOfTransactionsWholeMonth >= 20;

  input.evaluations.push(
    addEvaluation(
      Rule07,
      approved,
      {
        numOfAccountReports: accountReportList.length,
        averageNumberOfTransactionsWholeMonth,
        numOfTransactionsWholeMonth: 20,
      },
      'Stop if averageNumberOfTransactionsWholeMonth < 20',
      !approved,
    ),
  );
  return input;
}

export function Rule08(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const totalAverageCashFlowIncoming =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalAverageCashFlowIncoming;

  const totalAverageCashFlowOutcoming =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.additionalData
      .aggregatedAccountReport.aggregatedActivityReport
      .totalAverageCashFlowOutcoming;

  const approved =
    totalAverageCashFlowIncoming - totalAverageCashFlowOutcoming >= 0;

  input.evaluations.push(
    addEvaluation(
      Rule08,
      approved,
      {
        totalAverageCashFlowIncoming,
        amount: 0,
        totalAverageCashFlowOutcoming,
      },
      'Stop if totalAverageCashFlowIncoming - totalAverageCashFlowOutcoming < 0',
      !approved,
    ),
  );
  return input;
}

export function Rule09(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const meanTimeBetweenPayments =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.incomeVerification.primaryIncome
      .meanTimeBetweenPayments;

  const approved =
    meanTimeBetweenPayments >= 25 && meanTimeBetweenPayments <= 35;

  input.evaluations.push(
    addEvaluation(
      Rule09,
      approved,
      {
        meanTimeBetweenPayments,
      },
      'Stop if meanTimeBetweenPayments < 25 && meanTimeBetweenPayments > 35',
      !approved,
    ),
  );
  return input;
}

export function Rule10(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const numDaysInOverdraft1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.overdrafts
      .numDaysInOverdraft1M;
  const numDaysInOverdraft6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.overdrafts
      .numDaysInOverdraft6M;

  const firstCondition =
    numDaysInOverdraft1M /
      ((numDaysInOverdraft6M - numDaysInOverdraft1M) / 5) <=
    2;
  const secondCondition = numDaysInOverdraft1M <= 10;

  const approved = firstCondition || secondCondition;
  input.evaluations.push(
    addEvaluation(
      Rule10,
      approved,
      {
        numDaysInOverdraft1M,
        numDaysInOverdraft6M,
      },
      'Stop if numDaysInOverdraft1M / ((numDaysInOverdraft6M - numDaysInOverdraft1M) / 5) > 2 or numDaysInOverdraf > 10',
      !approved,
    ),
  );

  return input;
}

export function Rule11(input: RiskAssesmentUnit): RiskAssesmentUnit {
  const sumLoans1M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans1M;
  const sumLoans3M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumLoans3M;
  const sumRepayments6M =
    input.openBankingResponse.applicants.primaryConsumer.dataSourceResponses
      .BANKINGREPORTS.BANKINGREPORTS.Report.openBankingInsights.loans
      .sumRepayments6M;

  const firstCondition = sumLoans1M <= 150;
  const secondCondition = sumLoans1M <= sumLoans3M - sumLoans1M;
  const thirdCondition = sumRepayments6M >= sumLoans1M;

  const approved = firstCondition || secondCondition || thirdCondition;

  input.evaluations.push(
    addEvaluation(
      Rule11,
      approved,
      { sumLoans1M, sumLoans3M, sumRepayments6M },
      'Stop if sumLoans1M > 150 and sumLoans1M > sumLoans3M - sumLoans1M && sumRepayments6M < sumLoans1M',
      !approved,
    ),
  );
  return input;
}
