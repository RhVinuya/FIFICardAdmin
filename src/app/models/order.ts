import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

export class Order {
    public id? : string;
    public user_id?: string;
    public card_id? : string;
    public card_name?: string;
    public card_price? : number;
    public sender_name? : string;
    public sender_phone? : string;
    public sender_email? : string;
    public receiver_name? : string;
    public receiver_phone? : string;
    public receiver_email? : string;
    public address? : string;
    public anonymously? : boolean;
    public sendto? : string;
    public message? : string;
    public gateway?: string;
    public proof? : string;
    public transaction_id?: string;
    public payer_id?: string;
    public payer_email?: string;
    public status?: string;
    public created?: Timestamp;
    public modified?: Timestamp;
}
