import { AddressExtension } from './address-extension';

export class Address {
  city: string;
  country: string;
  extension: AddressExtension[];
  line: string[];
  postalCode: string;
  state: string;

  constructor(data: Address) {
    this.city = data && data.city ? data.city : null;
    this.country = data && data.country ? data.country : null;
    this.extension = data && data.extension ? data.extension : null;
    this.line = data && data.line ? data.line : null;
    this.postalCode = data && data.postalCode ? data.postalCode : null;
    this.state = data && data.state ? data.state : null;
  }
}
