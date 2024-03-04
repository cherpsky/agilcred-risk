import {
  ApplicantAddress,
  ApplicantName,
  ApplicantPhoneNumber,
} from '@applicant-interfaces/';

export interface ApplicantPersonalInformation {
  idType: string;
  idCode: string;
  dateOfBirth: string;
  emailAddress: string;
  addresses: ApplicantAddress[];
  phoneNumbers: ApplicantPhoneNumber[];
  name: ApplicantName[];
  reportId: string;
}
