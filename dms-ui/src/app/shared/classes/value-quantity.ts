export class ValueQuantity {
    value: number;
    unit: string;
    system: string;
    code: string;

    constructor(data: ValueQuantity) {
        this.value = data && data.value ? data.value : null;
        this.unit = data && data.unit ? data.unit : null;
        this.system = data && data.system ? data.system : null;
        this.code = data && data.code ? data.code : null;
    }
}