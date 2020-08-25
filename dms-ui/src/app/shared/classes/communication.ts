import { Language } from './language';

export class Communication {
  language: Language;

  constructor(data: Communication) {
    this.language = data && data.language ? data.language : null;
  }
}
