export class LongLatExtension {
  url: string;
  valueDecimal: number;

  constructor(data: LongLatExtension) {
    this.url = data && data.url ? data.url : null;
    this.valueDecimal = data && data.valueDecimal ? data.valueDecimal : null;
  }
}
