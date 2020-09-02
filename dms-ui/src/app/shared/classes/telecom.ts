export class Telecom {
  system: string;
  use: string;
  value: string;

  constructor(data: Telecom) {
    this.system = data && data.system ? data.system : null;
    this.use = data && data.use ? data.use : null;
    this.value = data && data.value ? data.value : null;
  }
}
