export class Type {
    public id: string;
    public name: string;
    public active: boolean;

    constructor(_name: string) {
        this.name = _name;
        this.active = true;
    }
}

export class TypeUpgrade {
    public id: string;
    public from: string;
    public to: string;
    public active: boolean;
    public add_price: number;

    constructor() {
        this.active = true;
    }
}
