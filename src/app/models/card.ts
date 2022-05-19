import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

export class Card{
    public id?: string;
    public code?: string;
    public name? : string;
    public description?: string;
    public details?: string;
    public price?: number;
    public active?: boolean;
    public bestseller?: boolean;
    public featured?: boolean;
    public event?: string; 
    public events?: string[];
    public recipient?: string;
    public recipients?: string[];
    public created?: Timestamp;
    public modified?: Timestamp;
    public images?: string[];
    public primary?: string;
    public ratings?: number;
}
