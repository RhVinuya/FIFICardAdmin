export class Fee {
    public id: string;
    public name: string;
    public metromanila: number;
    public luzon: number;
    public visayas: number;
    public mindanao: number;

    constructor (_name: string){
        this.name = _name;
    }
}
