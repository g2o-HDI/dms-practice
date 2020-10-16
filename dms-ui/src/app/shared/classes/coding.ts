export class Coding {
  system: string;
  code: string;
  display?: string;

  constructor(data: Coding) {
    this.code = data && data.code ? data.code : null;
    this.display = data && data.display ? data.display : null;
    this.system = data && data.system ? data.system : null;
  }
}
