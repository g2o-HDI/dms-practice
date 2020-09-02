import { Address } from './address';
import { Communication } from './communication';
import { Extension } from './extension';
import { MaritalStatus } from './marital-status';
import { Metas } from './metas';
import { Name } from './name';
import { Telecom } from './telecom';
import { GeneralText } from './general-text';

export class Patient {
  address: Address[];
  birthDate: string;
  communication: Communication[];
  extension: Extension[];
  gender: string;
  id: string;
  //   identifier: Identifier[];
  identifier: any;
  maritalStatus: MaritalStatus;
  meta: Metas;
  multipleBirthBoolean: boolean;
  name: Name[];
  resourceType: string;
  telecom: Telecom[];
  text: GeneralText;

  constructor(data: Patient) {
    this.address = data && data.address ? data.address : null;
    this.birthDate = data && data.birthDate ? data.birthDate : null;
    this.communication = data && data.communication ? data.communication : null;
    this.extension = data && data.extension ? data.extension : null;
    this.gender = data && data.gender ? data.gender : null;
    this.id = data && data.id ? data.id : null;
    this.identifier = data && data.identifier ? data.identifier : null;
    this.maritalStatus = data && data.maritalStatus ? data.maritalStatus : null;
    this.meta = data && data.meta ? data.meta : null;
    this.multipleBirthBoolean =
      data && data.multipleBirthBoolean ? data.multipleBirthBoolean : null;
    this.name = data && data.name ? data.name : null;
    this.resourceType = data && data.resourceType ? data.resourceType : null;
    this.telecom = data && data.telecom ? data.telecom : null;
    this.text = data && data.text ? data.text : null;
  }
}
