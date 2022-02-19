export class Recipient {
    public id: string;
    public name: string;
    public active: boolean;

    constructor(_name: string){
        this.name = _name;
        this.active = true;
    }
}
