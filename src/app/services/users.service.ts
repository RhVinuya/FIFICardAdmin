import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../models/user';
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  db: AngularFirestore;
  auth: AngularFireAuth;

  constructor(_db: AngularFirestore,
    _auth: AngularFireAuth){
    this.db = _db;
    this.auth = _auth;
  }

  async getUsers(): Promise<User[]>{
    return new Promise((resolve, rejects) => {
        this.db.collection('users').get().subscribe(data => {
            if (!data.empty)
            {
                let users: User[] = [];
                data.forEach(doc => {
                    let user: User = doc.data() as User;
                    user.id = doc.id;
                    users.push(user);
                });
                resolve(users);
            }
            else{
                rejects("No users found.");
            }
        });
    });
  }

  async getUser(id: string): Promise<User>{
    return new Promise((resolve, rejects) => {
        this.db.collection('users').doc(id).get().subscribe(doc =>{
            if (doc.exists){
                let user: User = doc.data() as User;
                user.id = doc.id;
                resolve(user);
            }
            else{
                rejects("User not found.");
            }
        });
    });
  }

  async registerUser(email: string, password: string): Promise<string>{
    return new Promise((resolve, rejects) => {
      this.auth.auth.createUserWithEmailAndPassword(email, password).then(data => {
        resolve(data.user.uid);
      }).catch(reason => {
        rejects(reason);
      });
    });
  }

  async addUser(user: User): Promise<string>{
    return new Promise(resolve => {
        this.db.collection('users').add({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          localId: user.localId,
          active: true,
          created: Timestamp.now()
        }).then(data => {
            resolve(data.id);
        })
    });
  }

  async updateUser(user: User): Promise<void>{
    return this.db.collection('users').doc(user.id).update({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        active: user.active,
        modified: Timestamp.now()
    });
  }

  async getUserByEmail(email: string): Promise<User>{
    return new Promise((resolve, rejects) => {
      this.db.collection('users').ref.where("email","==",email).get().then(value => {
        let user: User = value.docs[0].data() as User;
        resolve(user);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  async signIn(email: string, password: string): Promise<boolean>{
    return new Promise((resolve, rejects) => {
      this.auth.auth.signInWithEmailAndPassword(email, password).then(data => {
        resolve(true);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }
}
