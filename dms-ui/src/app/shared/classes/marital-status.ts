import { Coding } from './coding';

export class MaritalStatus {
  coding: Coding[];
  text: string;

  constructor(data: MaritalStatus) {
    this.coding = data && data.coding ? data.coding : null;
    this.text = data && data.text ? data.text : null;
  }
}
