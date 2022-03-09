export class Occasion {
    public id: string;
    public name: string;
    public active: boolean;
    public isGift: boolean;

    constructor(_name: string){
        this.name = _name;
        this.active = true;
        this.isGift = false;
    }
}
