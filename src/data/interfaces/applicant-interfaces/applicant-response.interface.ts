export interface RootResponse {
  applicants: Applicants;
  additionalInputData: AdditionalInputData;
  additionalOutputData: AdditionalOutputData;
  timestamp: string;
  transactionState: string;
  interactionId: string;
  transactionId: number;
  importe_total?: number;
}

export interface Applicants {
  customerReferenceIdentifier: string;
  primaryConsumer: PrimaryConsumer;
}

export interface PrimaryConsumer {
  personalInformation: PersonalInformation;
  dataSourceResponses: DataSourceResponses;
  output: Output;
}

export interface PersonalInformation {
  idType: string;
  idCode: string;
  dateOfBirth: string;
  emailAddress: string;
  addresses: Address[];
  phoneNumbers: PhoneNumber[];
  name: Name[];
  reportId: string;
}

export interface Address {
  postalCode: string;
}

export interface PhoneNumber {
  identifier: string;
  telephoneNumber: string;
}

export interface Name {
  firstName: string;
  lastName: string;
}

export interface DataSourceResponses {
  BANKINGREPORTS: Bankingreports;
  EIPG: Eipg;
}

export interface Bankingreports {
  BANKINGREPORTS: Bankingreports2;
}

export interface Bankingreports2 {
  identifier: string;
  returnCode: string;
  Report: Report;
}

export interface Report {
  equifaxRequestId: string;
  processFinishedTime: string;
  processStartTime: string;
  processStatus: string;
  reportNumber: number;
  miscParams: MiscParam[];
  accountReportList: AccountReportList[];
  userDetails: UserDetails;
  bankInfo: BankInfo;
  accountList: AccountList[];
  incomeVerification: IncomeVerification;
  openBankingInsights: OpenBankingInsights;
  categorySums: CategorySums;
  additionalData: AdditionalData;
}

export interface MiscParam {
  name: string;
  value: string;
}

export interface AccountReportList {
  number: string;
  totalNumberOfTransactions: number;
  wholeMonthsAvailable: number;
  averageNumberOfTransactionsWholeMonth: number;
  averageAmountOfIncomingTransactionsWholeMonth: number;
  averageAmountOfOutgoingTransactionsWholeMonth: number;
  averageMinimumBalanceWholeMonth: number;
  cashFlow: CashFlow[];
}

export interface CashFlow {
  calendarMonth: string;
  incoming: number;
  outgoing: number;
  minBalance: number;
  maxBalance: number;
  avgBalance: number;
  isWholeMonth: boolean;
}

export interface UserDetails {
  name: string;
  address: string[];
  phone: string[];
  email: string[];
  personalIdentifier: PersonalIdentifier[];
}

export interface PersonalIdentifier {
  name: string;
  value: string;
}

export interface BankInfo {
  name: string;
  country: string;
  id: string;
}

export interface AccountList {
  number: string;
  type: string;
  balance: number;
  currency: string;
  iban: string;
  holderName: string;
  availableAmount: number;
  transactionList: TransactionList[];
}

export interface TransactionList {
  onDate: string;
  valueDate: string;
  description: string;
  amount: string;
  balance: string;
  params: Param[];
}

export interface Param {
  name: string;
  value: string;
}

export interface IncomeVerification {
  primaryIncome: PrimaryIncome;
  secondaryIncomes: SecondaryIncomes;
  otherRecurIncome: OtherRecurIncome;
  version: string;
}

export interface PrimaryIncome {
  meanAmountPayment: number;
  last45dFound: number;
  avg6m: number;
  avg3m: number;
  meanTimeBetweenPayments: number;
  trend3m: number;
  daysAgoLastPayment: number;
  trend6m: number;
  amountLastPayment: number;
  spanMonths: number;
  trend12m: number;
  avg12m: number;
  numPayments: number;
  descriptions: string[];
}

export interface SecondaryIncomes {
  meanAmountPayment: number;
  last45dFound: number;
  avg6m: number;
  avg3m: number;
  meanTimeBetweenPayments: number;
  trend3m: number;
  daysAgoLastPayment: number;
  trend6m: number;
  amountLastPayment: number;
  spanMonths: number;
  trend12m: number;
  avg12m: number;
  numPayments: number;
  descriptions: string[];
}

export interface OtherRecurIncome {
  meanAmountPayment: number;
  last45dFound: number;
  avg6m: number;
  avg3m: number;
  meanTimeBetweenPayments: number;
  trend3m: number;
  daysAgoLastPayment: number;
  trend6m: number;
  amountLastPayment: number;
  spanMonths: number;
  trend12m: number;
  avg12m: number;
  numPayments: number;
  descriptions: any[];
}

export interface OpenBankingInsights {
  savings: Savings;
  incomeTrends: IncomeTrends;
  cashFlow: CashFlow2;
  accountActivity: AccountActivity;
  collections: Collections;
  overdrafts: Overdrafts;
  lowBalances: LowBalances;
  loans: Loans;
  spendingDistribution: SpendingDistribution;
  accountOverview: AccountOverview;
  balances: Balances;
  transactionStats: TransactionStats;
  gamblingVsIncome: GamblingVsIncome;
  atmWithdrawals: AtmWithdrawals;
  monthlyPaymentVariance: MonthlyPaymentVariance;
  experimentalFeatures: any[];
}

export interface Savings {
  sumSavings1W: number;
  numSavings6M: number;
  numSavingsTotal: number;
  sumSavingsTotal: number;
  sumSavings1M: number;
  sumSavings3M: number;
  sumSavings12M: number;
  version: string;
  numSavings12M: number;
  numSavings3M: number;
  numSavings1W: number;
  sumSavings6M: number;
  numSavings1M: number;
}

export interface IncomeTrends {
  avg30dRollingRecent: number;
  avg30dRollingPast: number;
  version: string;
  avgRollingTrend: number;
  avgRollingDiff: number;
}

export interface CashFlow2 {
  positiveCashflow1M: number;
  positiveCashflow1W: number;
  negativeCashflow3M: number;
  positiveCashflowTotal: number;
  positiveCashflow3M: number;
  negativeCashflowTotal: number;
  negativeCashflow1W: number;
  negativeCashflow12M: number;
  negativeCashflow1M: number;
  version: string;
  positiveCashflow6M: number;
  positiveCashflow12M: number;
  negativeCashflow6M: number;
  positiveNegativeRatio6M: number;
  positiveNegativeRatioTotal: number;
  positiveNegativeRatio3M: number;
  positiveNegativeRatio1W: number;
  positiveNegativeRatio1M: number;
  positiveNegativeRatio12M: number;
}

export interface AccountActivity {
  activityIncTotal: number;
  activity12M: number;
  activityInc1W: number;
  activity1W: number;
  activity3M: number;
  activity1M: number;
  trnsPerDay: number;
  activityInc12M: number;
  daysSinceLastTrn: number;
  activityOut12M: number;
  activityInc1M: number;
  activityOut3M: number;
  version: string;
  daysOfOutTrns: number;
  activityInc3M: number;
  activityInc6M: number;
  daysOfTrns: number;
  activityOut6M: number;
  activityOut1W: number;
  activityOut1M: number;
  daysSinceFirstTrn: number;
  activityOutTotal: number;
  activityTotal: number;
  activity6M: number;
  daysOfIncTrns: number;
}

export interface Collections {
  sumCollections3M: number;
  numCollectionsTotal: number;
  sumCollections6M: number;
  numCollections1W: number;
  sumCollections12M: number;
  sumCollectionsTotal: number;
  numCollections1M: number;
  version: string;
  numCollections6M: number;
  sumCollections1M: number;
  sumCollections1W: number;
  numCollections12M: number;
  numCollections3M: number;
}

export interface Overdrafts {
  numDaysInOverdraft1W: number;
  numDaysInOverdraft1M: number;
  numOverdraft3M: number;
  numOverdraft6M: number;
  numDaysInOverdraft3M: number;
  numDaysInOverdraftTotal: number;
  numOverdraftTotal: number;
  numOverdraft12M: number;
  version: string;
  numOverdraft1W: number;
  numOverdraft1M: number;
  numDaysInOverdraft12M: number;
  numDaysInOverdraft6M: number;
}

export interface LowBalances {
  daysBalanceBelow7_3M: number;
  daysBalanceBelow0_1W: number;
  daysBalanceBelow0_3M: number;
  daysBalanceBelow7_1W: number;
  daysBalanceBelow0_12M: number;
  version: string;
  daysBalanceBelow0_6M: number;
  daysBalanceBelow7_1M: number;
  daysBalanceBelow7_Total: number;
  daysBalanceBelow0_Total: number;
  daysBalanceBelow0_1M: number;
  daysBalanceBelow7_12M: number;
  daysBalanceBelow7_6M: number;
}

export interface Loans {
  sumRepayments12M: number;
  sumRepaymentsTotal: number;
  sumRepayments1W: number;
  sumLoansTotal: number;
  sumLoans3M: number;
  sumLoans1W: number;
  version: string;
  sumRepayments3M: number;
  sumLoans1M: number;
  sumLoans12M: number;
  sumRepayments1M: number;
  sumRepayments6M: number;
  sumLoans6M: number;
  repaymentLoanRatio3M: number;
  repaymentLoanRatioTotal: number;
  repaymentLoanRatio6M: number;
  repaymentLoanRatio12M: number;
}

export interface SpendingDistribution {
  lastMonthSumBetweenPositive1000ToPositive2000: number;
  lastMonthSumBetweenPositive50ToPositive100: number;
  lastMonthSumBetweenMinus5To0: number;
  lastMonthSumBetweenPositive2000ToPositiveInf: number;
  lastMonthSumBetweenPositive500ToPositive1000: number;
  lastMonthSumBetween0ToPositive5: number;
  lastMonthSumBetweenPositive20ToPositive50: number;
  lastMonthSumBetweenMinus50ToMinus20: number;
  version: string;
  lastMonthSumBetweenPositive10ToPositive20: number;
  lastMonthSumBetweenMinus200ToMinus100: number;
  lastMonthSumBetweenMinus2000ToMinus1000: number;
  lastMonthSumBetweenPositive200ToPositive500: number;
  lastMonthSumBetweenMinusinfToMinus2000: number;
  lastMonthSumBetweenPositive5ToPositive10: number;
  lastMonthSumBetweenPositive100ToPositive200: number;
  lastMonthSumBetweenMinus1000ToMinus500: number;
  lastMonthSumBetweenMinus20ToMinus10: number;
  lastMonthSumBetweenMinus500ToMinus200: number;
  lastMonthSumBetweenMinus10ToMinus5: number;
  trendBetweenPositive2000ToPositiveInf: number;
  lastMonthSumBetweenMinus100ToMinus50: number;
  lastMonthSum1000To2000: number;
  trend0To5: number;
  lastMonthSum50To100: number;
  lastMonthSum5To0: number;
  trend20To50: number;
  trend200To100: number;
  lastMonthSum2000ToInf: number;
  trend500To1000: number;
  lastMonthSum500To1000: number;
  lastMonthSum0To5: number;
  lastMonthSum20To50: number;
  lastMonthSum50To20: number;
  trend200To500: number;
  trend100To50: number;
  trend10To5: number;
  trend10To20: number;
  lastMonthSum10To20: number;
  lastMonthSum200To100: number;
  lastMonthSum2000To1000: number;
  lastMonthSum200To500: number;
  lastMonthSumInfTo2000: number;
  trend5To10: number;
  trend50To20: number;
  trend100To200: number;
  lastMonthSum5To10: number;
  lastMonthSum100To200: number;
  trend50To100: number;
  trend500To200: number;
  lastMonthSum1000To500: number;
  trend20To10: number;
  lastMonthSum20To10: number;
  lastMonthSum500To200: number;
  trend5To0: number;
  lastMonthSum10To5: number;
  lastMonthSum100To50: number;
}

export interface AccountOverview {
  numAccounts: number;
  numAccountTypes: number;
  numAccountHolders: number;
  numCurrencies: number;
  version: string;
}

export interface Balances {
  stdBalance3M: number;
  meanBalance1W: number;
  maxBalance12M: number;
  minBalance1M: number;
  meanBalance6M: number;
  minBalance3M: number;
  maxBalance1M: number;
  lastBalance: number;
  maxBalance6M: number;
  changeInFirstLastBalance: number;
  stdBalance1W: number;
  meanBalance12M: number;
  meanBalance1M: number;
  meanBalance3M: number;
  maxBalance3M: number;
  maxBalance1W: number;
  version: string;
  firstBalance: number;
  meanBalanceTotal: number;
  stdBalance1M: number;
  stdBalance6M: number;
  maxBalanceTotal: number;
  minBalance6M: number;
  minBalance12M: number;
  stdBalance12M: number;
  stdBalanceTotal: number;
  minBalanceTotal: number;
  minBalance1W: number;
}

export interface TransactionStats {
  numIncTrns12M: number;
  numUniqueIncTrns1W: number;
  numTrnsTotal: number;
  numUniqueTrns1W: number;
  numUniqueIncTrns1M: number;
  meanIncAmount1W: number;
  sumAmounts12M: number;
  numUniqueOutTrnsTotal: number;
  meanAmount1M: number;
  meanIncAmount1M: number;
  numUniqueTrns3M: number;
  sumAmounts3M: number;
  maxIncAmount1M: number;
  numUniqueOutTrns1W: number;
  meanAmount1W: number;
  meanOutAmount3M: number;
  numOutTrns12M: number;
  meanAmountTotal: number;
  numOutTrns6M: number;
  sumIncAmounts1M: number;
  sumOutAmounts3M: number;
  meanOutAmount6M: number;
  maxIncAmount1W: number;
  sumOutAmountsTotal: number;
  numTrns3M: number;
  sumOutAmounts12M: number;
  numTrns12M: number;
  sumIncAmountsTotal: number;
  maxOutAmount1M: number;
  maxIncAmount3M: number;
  sumIncAmounts12M: number;
  sumAmountsTotal: number;
  meanAmount12M: number;
  numIncTrns3M: number;
  numUniqueOutTrns12M: number;
  numTrns6M: number;
  meanOutAmount1W: number;
  numIncTrnsTotal: number;
  meanOutAmount12M: number;
  numIncTrns1M: number;
  version: string;
  numUniqueOutTrns3M: number;
  meanAmount6M: number;
  meanOutAmountTotal: number;
  numOutTrns1M: number;
  numIncTrns1W: number;
  numTrns1W: number;
  maxOutAmount1W: number;
  maxOutAmount12M: number;
  numUniqueOutTrns6M: number;
  sumIncAmounts3M: number;
  numOutTrns1W: number;
  meanIncAmount6M: number;
  meanOutAmount1M: number;
  sumIncAmounts1W: number;
  numUniqueTrns12M: number;
  numOutTrns3M: number;
  numUniqueTrns6M: number;
  meanIncAmount12M: number;
  maxIncAmount12M: number;
  numUniqueIncTrns3M: number;
  sumOutAmounts6M: number;
  sumAmounts1M: number;
  sumAmounts6M: number;
  maxIncAmount6M: number;
  numUniqueTrns1M: number;
  meanIncAmount3M: number;
  numOutTrnsTotal: number;
  sumIncAmounts6M: number;
  numUniqueOutTrns1M: number;
  meanIncAmountTotal: number;
  sumOutAmounts1M: number;
  maxOutAmount3M: number;
  maxOutAmount6M: number;
  sumAmounts1W: number;
  numUniqueTrnsTotal: number;
  maxIncAmountTotal: number;
  numUniqueIncTrns6M: number;
  numIncTrns6M: number;
  sumOutAmounts1W: number;
  maxOutAmountTotal: number;
  numUniqueIncTrns12M: number;
  meanAmount3M: number;
  numUniqueIncTrnsTotal: number;
  numTrns1M: number;
}

export interface GamblingVsIncome {
  gamblingIncomeRatio3M: number;
  gamblingIncomeRatio1W: number;
  sumGambling1W: number;
  gamblingIncomeRatioTotal: number;
  gamblingIncomeRatio12M: number;
  sumGamblingTotal: number;
  version: string;
  gamblingIncomeRatio1M: number;
  sumGambling6M: number;
  sumGambling12M: number;
  gamblingIncomeRatio6M: number;
  sumGambling3M: number;
  sumGambling1M: number;
}

export interface AtmWithdrawals {
  sumAtmWithdrawals6M: number;
  sumAtmWithdrawals3M: number;
  sumAtmWithdrawalsTotal: number;
  version: string;
  sumAtmWithdrawals1W: number;
  sumAtmWithdrawals1M: number;
  sumAtmWithdrawals12M: number;
  atmExpensesRatioTotal: number;
  atmExpensesRatio1W: number;
  atmExpensesRatio1M: number;
  atmExpensesRatio6M: number;
  atmExpensesRatio3M: number;
  atmExpensesRatio12M: number;
}

export interface MonthlyPaymentVariance {
  numMonthlyExpenseStreams: number;
  maxNormStdMonthlyExpenseStreams: number;
  maxStdMonthlyExpenseStreams: number;
  avgNormStdMonthlyExpenseStreams: number;
  avgStdMonthlyExpenseStreams: number;
  avgStdTiming: number;
  version: string;
  maxStdTiming: number;
}

export interface CategorySums {
  incoming: Incoming[];
  outgoing: any[];
}

export interface Incoming {
  category: string;
  weightedSum: number;
  normalizedSum: number;
}

export interface AdditionalData {
  aggregatedAccountReport: AggregatedAccountReport;
  miscOpenBanking: MiscOpenBanking;
}

export interface AggregatedAccountReport {
  aggregatedActivityReport: AggregatedActivityReport;
  aggregatedAccountBalance: AggregatedAccountBalance;
  currentAccountBalance: CurrentAccountBalance[];
}

export interface AggregatedActivityReport {
  totalAverageCashFlowOutcoming12M: number;
  totalCashFlowOutcoming12M: number;
  totalCashFlowOutcoming10M: number;
  totalCashFlowIncoming5M: number;
  totalCashFlowOutcoming8M: number;
  totalCashFlowIncoming7M: number;
  totalCashFlowIncoming1M: number;
  totalAverageCashFlowIncoming3M: number;
  totalCashFlowIncoming3M: number;
  totalCashFlowOutcoming1M: number;
  totalCashFlowOutcoming3M: number;
  totalCashFlowOutcoming5M: number;
  totalWholeMonthsOfTransactions: number;
  totalCashFlowOutcoming7M: number;
  cuentas: string;
  totalAverageCashFlowOutcoming3M: number;
  totalAverageCashFlowIncoming: number;
  totalCashFlowIncoming11M: number;
  totalAverageCashFlowIncoming6M: number;
  totalAccountTransactions: number;
  totalAverageCashFlowMinBalance: number;
  totalCashFlowOutcoming11M: number;
  totalAverageNumberOfTransactionsWholeMonth: number;
  totalCashFlowOutcoming9M: number;
  totalCashFlowIncoming6M: number;
  totalCashFlowIncoming8M: number;
  totalCashFlowIncoming2M: number;
  totalCashFlowIncoming4M: number;
  totalAverageCashFlowIncoming12M: number;
  totalCashFlowOutcoming2M: number;
  totalCashFlowIncoming9M: number;
  totalCashFlowOutcoming4M: number;
  totalCashFlowOutcoming6M: number;
  totalAverageCashFlowOutcoming6M: number;
  totalCashFlowIncoming12M: number;
  totalAverageCashFlowOutcoming: number;
  totalCashFlowIncoming10M: number;
}

export interface AggregatedAccountBalance {
  totalAverageAccountBalance1M: number;
  totalAverageAccountBalance3M: number;
  totalCurrentAccountBalance: number;
  totalAverageMaximumAccountBalance6M: number;
  totalMaximumAccountBalance6M: number;
  totalAverageMaximumAccountBalance3M: number;
  totalMaximumAccountBalance12M: number;
  totalMinimumAccountBalance1M: number;
  totalAverageAccountBalance12M: number;
  totalMinimumAccountBalance12M: number;
  totalMaximumAccountBalance1M: number;
  totalMinimumAccountBalance3M: number;
  totalMinimumAccountBalance6M: number;
  totalMaximumAccountBalance3M: number;
  totalAverageAccountBalance6M: number;
  totalAverageMaximumAccountBalance12M: number;
  totalAverageMinumumAccountBalance6M: number;
  totalAverageMinimunAccountBalance12M: number;
  totalAverageMinumumAccountBalance3M: number;
}

export interface CurrentAccountBalance {
  averageMaximumAccountBalance3M: number;
  averageMinimunAccountBalance12M: number;
  totalAverageAccountBalance12M: number;
  averageMaximumAccountBalance6M: number;
  totalAverageAccountBalance3M: number;
  averageMinumumAccountBalance3M: number;
  totalAverageAccountBalance6M: number;
  averageMinumumAccountBalance6M: number;
  averageMaximumAccountBalance12M: number;
}

export interface MiscOpenBanking {
  typeVertical: string;
  entityCode: string;
}

export interface Eipg {
  RISK: Risk;
}

export interface Risk {
  identifier: string;
  idCode: string;
  returnCode: string;
  present: string;
  araAttributes: AraAttributes;
}

export interface AraAttributes {
  totalNumberOfOperations: number;
  numberOfConsumerCreditOperations: number;
  numberOfMortgageOperations: number;
  numberOfPersonalLoanOperations: number;
  numberOfCreditCardOperations: number;
  numberOfTelcoOperations: number;
  totalNumberOfOtherUnpaid: number;
  totalUnpaidBalance: number;
  unpaidBalanceOwnEntity: number;
  unpaidBalanceOfOtherEntities: number;
  unpaidBalanceOfConsumerCredit: number;
  unpaidBalanceOfMortgage: number;
  unpaidBalanceOfPersonalLoan: number;
  unpaidBalanceOfCreditCard: number;
  unpaidBalanceOfTelco: number;
  unpaidBalanceOfOtherProducts: number;
  worstUnpaidBalance: number;
  numberOfDaysOfWorstSituation: number;
  numberOfCreditors: number;
  delincuencyDays: number;
  worstSituationCode: string;
}

export interface Output {
  CalificacionHibrido: string;
  CodigoError: string;
}

export interface AdditionalInputData {
  dataAttribute: DataAttribute[];
}

export interface DataAttribute {
  name: string;
  value: string;
}

export interface AdditionalOutputData {
  dataAttribute: DataAttribute[];
}
