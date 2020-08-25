import { LongLatExtension } from './long-lat-extension';

export class AddressExtension {
  extension: LongLatExtension[];
  url: string;

  constructor(data: AddressExtension) {
    this.extension = data && data.extension ? data.extension : null;
    this.url = data && data.url ? data.url : null;
  }
}
