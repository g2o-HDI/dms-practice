export class Coding {
  code: string;
  display: string;
  system: string;

  constructor(data: Coding) {
    this.code = data && data.code ? data.code : null;
    this.display = data && data.display ? data.display : null;
    this.system = data && data.system ? data.system : null;
  }
}
