export interface ApplicantResponse {
  customerReferenceIdentifier: string;
  primaryConsumer: {
    personalInformation: {
      idType: string;
      idCode: string;
      dateOfBirth: string;
      emailAddress: string;
      addresses: {
        postalCode: string;
      }[];
      phoneNumbers: {
        identifier: string;
        telephoneNumber: string;
      }[];
      name: {
        firstName: string;
        lastName: string;
      }[];
      reportId: string;
    };
    dataSourceResponses: {
      BANKINGREPORTS: {
        BANKINGREPORTS: {
          identifier: string;
          returnCode: string;
          Report: {
            equifaxRequestId: string;
            processFinishedTime: string;
            processStartTime: string;
            processStatus: string;
            reportNumber: number;
            miscParams: {
              name: string;
              value: string;
            }[];
            accountReportList: {
              number: string;
              totalNumberOfTransactions: number;
              wholeMonthsAvailable: number;
              averageNumberOfTransactionsWholeMonth: number;
              averageAmountOfIncomingTransactionsWholeMonth: number;
              averageAmountOfOutgoingTransactionsWholeMonth: number;
              averageMinimumBalanceWholeMonth: number;
              cashFlow: {
                calendarMonth: string;
                incoming: number;
                outgoing: number;
                minBalance: number;
                maxBalance: number;
                avgBalance: number;
                isWholeMonth: boolean;
              }[];
            }[];
          };
        };
      };
    };
  };
  bankInfo: {
    name: string;
    country: string;
    id: string;
  };
  accountList: {
    number: string;
    type: string;
    balance: number;
    currency: string;
    iban: string;
    holderName: string;
    availableAmount: number;
    transactionList: {
      onDate: string;
      valueDate: string;
      description: string;
      amount: string;
      balance: string;
      params: {
        name: string;
        value: string;
      }[];
    }[];
  }[];
  userDetails: {
    name: string;
    address: string[];
    phone: string[];
    email: string[];
    personalIdentifier: {
      name: string;
      value: string;
    }[];
  };
  incomeVerification: {
    primaryIncome: {
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
    };
    secondaryIncomes: {
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
    };
    otherRecurIncome: {
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
    };
    version: string;
  };
  openBankingInsights: {
    savings: {
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
    };
    incomeTrends: {
      avg30dRollingRecent: number;
      avg30dRollingPast: number;
      version: string;
      avgRollingTrend: number;
      avgRollingDiff: number;
    };
    cashFlow: {
      positiveCashflow1M: number;
      positiveCashflow1W: number;
      negativeCashflow3M: number;
      positiveCashflow3M: number;
      positiveCashflow12M: number;
      negativeCashflow1W: number;
      negativeCashflow1M: number;
      positiveCashflow6M: number;
      negativeCashflow6M: number;
      negativeCashflow12M: number;
      version: string;
    };
    debitTrends: {
      avg30dRollingRecent: number;
      avg30dRollingPast: number;
      version: string;
      avgRollingTrend: number;
      avgRollingDiff: number;
    };
    expenseTrends: {
      avg30dRollingRecent: number;
      avg30dRollingPast: number;
      version: string;
      avgRollingTrend: number;
      avgRollingDiff: number;
    };
  };
}
