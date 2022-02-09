import { firestore } from "firebase";
import Timestamp = firestore.Timestamp

export class User {
    public id?: string;
    public firstname?: string;
    public lastname?: string;
    public email?: string
    public localId?: string;
    public changePassword?: Boolean;
    public active?: boolean;
    public created?: Timestamp;
    public modified?: Timestamp;
}
