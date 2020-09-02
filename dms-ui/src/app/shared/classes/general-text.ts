export class GeneralText {
  div: string;
  status: string;

  constructor(data: GeneralText) {
    this.div = data && data.div ? data.div : null;
    this.status = data && data.status ? data.status : null;
  }
}
