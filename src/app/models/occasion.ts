export class Occasion {
    public id: string;
    public name: string;
    public active: boolean;
    public isGift: boolean;
    public isCreations: boolean;
    public isSticker: boolean;

    constructor(_name: string){
        this.name = _name;
        this.active = true;
        this.isGift = false;
        this.isCreations = false;
        this.isSticker = false;
    }
}
