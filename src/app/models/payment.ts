import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

export class Payment {
    public id?: string;
    public userId: string;
    public gateway: string;
    public orders: string[];
    public total: number;
    public proof: string;
    public transactionId: string;
    public payerId: string;
    public payerEmail: string;
    public status: string;
    public created: Timestamp;
}