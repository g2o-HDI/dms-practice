export class Name {
  family: string;
  given: string[];
  prefix: string[];
  use: string;

  constructor(data: Name) {
    this.family = data && data.family ? data.family : null;
    this.given = data && data.given ? data.given : null;
    this.prefix = data && data.prefix ? data.prefix : null;
    this.use = data && data.use ? data.use : null;
  }
}
