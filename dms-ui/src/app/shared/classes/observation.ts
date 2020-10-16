import { CookieService } from 'ng2-cookies';
import { Coding } from './coding';
import { ValueQuantity } from './value-quantity';

export class Observation {
    resourceType: string;
    category: { coding: Coding[] };
    code: { coding: Coding[] };
    subject : { reference: string };
    context: { reference: string };
    effectiveDateTime: string;
    issued: string;
    valueQuantity: ValueQuantity ;

    constructor(data: Observation) {
        this.resourceType = data && data.resourceType ? data.resourceType : null;
        this.subject = data && data.subject ?  data.subject : null;
        this.category = data && data.category ? data.category : null;
        this.code = data && data.code ? data.code : null;
        this.context = data && data.context ? data.context : null;
        this.valueQuantity = data && data.valueQuantity ? data.valueQuantity : null;
        this.effectiveDateTime = data && data.effectiveDateTime ? data.effectiveDateTime : null;
        this.issued = data && data.issued ? data.issued : null;
    }
}