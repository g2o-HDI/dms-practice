import { Patient } from './patient';

export class FihrPatient {
  fullUrl: string;
  resource: Patient;

  constructor(data: FihrPatient) {
    this.fullUrl = data && data.fullUrl ? data.fullUrl : null;
    this.resource = data && data.resource ? data.resource : null;
  }
}
