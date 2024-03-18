import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { Registro } from 'src/app/services/auth/models/registro';

const Path = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthRegistroService {
  

  constructor(
    private _auth: Auth,
    private _firestore: Firestore
  ) {}

  createUserInFirestore(registro: Registro){
    const useRef = doc(this._firestore, Path, registro.uid);
    return setDoc(useRef, {
      uid: registro.uid,
      nombreapellido: registro.nombreapellido,
      numeroDNI: registro.numeroDNI,
      fechanacimiento: registro.fechanacimiento,
      numerotelefono: registro.numerotelefono,
      imagenperfil: registro.imagenperfil
    });
  }

  registerUserWithEmailAndPassword(registro: Registro){
    if (!this.isUsertLoggedIn()) {
      return Promise.reject('Ya existe una sesión activa.');
    }
    return createUserWithEmailAndPassword(
      this._auth,
      registro.email,
      registro.contrasena,
    );
  }

  async getUserLogged() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const userDocument = doc(this._firestore, Path, user.uid);
      const userSnapshot = await getDoc(userDocument);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as Registro;
        return userData;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async isUsertLoggedIn() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  private getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve) => {
      this._auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  updateUser(user: Registro): Promise<void>{
    if (!user.uid) {
      throw Error('User not found');
    }
    const userDocument = doc(this._firestore, Path, user.uid);
    return setDoc(userDocument, user, { merge: true });
  }
}