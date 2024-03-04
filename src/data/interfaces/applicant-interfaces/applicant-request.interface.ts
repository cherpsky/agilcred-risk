import { ApplicantPersonalInformation } from './applicant-personal-information.interface';

type AdditionalInputDataAttribute = {
  name: string;
  value: string;
};

type AdditionalInputData = {
  dataAttribute: AdditionalInputDataAttribute[];
};

type ApplicantData = {
  customerReferenceIdentifier: string;
  primaryConsumer: {
    personalInformation: ApplicantPersonalInformation;
  };
};

export type ApplicantRequest = {
  applicants: {
    [key: string]: ApplicantData;
  };
  additionalInputData: AdditionalInputData;
};
