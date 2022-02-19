export class Status {
    public id: string;
    public name: string;
    public active: boolean;
    public initial: boolean;

    constructor(_name: string){
        this.name = _name;
        this.active = true;
        this.initial = false;
    }
}
