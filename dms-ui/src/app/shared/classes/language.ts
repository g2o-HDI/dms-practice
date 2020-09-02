import { Coding } from './coding';

export class Language {
  coding: Coding[];
  text: string;

  constructor(data: Language) {
    this.coding = data && data.coding ? data.coding : null;
    this.text = data && data.text ? data.text : null;
  }
}
