import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Registro } from 'src/app/services/auth/models/registro';

const Path = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthRegistroService {

  private _auth = inject(Auth)
  private _firestore = inject(Firestore)
  private _collection = collection(this._firestore, Path)

  createUserInFirestore(registro: Registro){
    const userReference = doc(this._collection, registro.uid)
    return setDoc(userReference, {
      nombreapellido: registro.nombreapellido,
      email: registro.email,

    })
  }

  registerUserWithEmailAndPassword(registro: Registro){
    if (this.isUsertLoggedIn()) {
      return Promise.reject('Ya existe una sesión activa.');
    }
    return createUserWithEmailAndPassword(
      this._auth,
      registro.email,
      registro.contrasena,
    );
  }


  private isUsertLoggedIn(){
    return !!this.getCurrentUser();
  }

  private getCurrentUser(){
    return this._auth.currentUser;
  }
  
}
