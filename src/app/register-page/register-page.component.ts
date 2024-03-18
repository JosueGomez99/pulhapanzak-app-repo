import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonNav,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonText,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { Registro } from '../services/auth/models/registro'
import { Router, RouterLink, RouterModule } from '@angular/router';
import { group } from '@angular/animations';
import { AuthRegistroService } from '../auth-registro/services/auth-registro.service';
import { user } from '@angular/fire/auth';

const Passuno = document.getElementById('contrasena');
const Passsegundo = document.getElementById('ConfirmarContrasena');

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    IonButton,
    IonText,
    IonItem,
    RouterLink, 
    IonRouterLink,
    RouterModule,
  ]
})
export class RegisterPageComponent {

  

  
  private authService = inject(AuthRegistroService)
  formBuilder = inject(FormBuilder);
  private router = inject(Router)
  

  loginForm: FormGroup = this.formBuilder.group({
    nombreapellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    ConfirmarContrasena: ['', Validators.required],
  }, { validator: this.checkPasswords })

  checkPasswords(group: FormGroup) { 
    let pass = group.controls['contrasena'].value;
    let confirmPass = group.controls['ConfirmarContrasena'].value;

    return pass === confirmPass ? null : { notSame: true }     
  }
  
  

  get RegisterNombreApellidoInvalido(): boolean{
    const registercontrolNombreApellido = this.loginForm.get('nombreapellido');

    if (registercontrolNombreApellido) {
      return registercontrolNombreApellido.hasError('required');
      
    }
      return false;
  }

  get RegisterEmailInvalido(): boolean{
    const registercontrolEmail = this.loginForm.get('email');

    if (registercontrolEmail) {
      return registercontrolEmail.hasError('email');
      
    }
      return false;
  }
  
  
  get RegisterContrasenaInvalido(): boolean{
    const registercontrolContrasena = this.loginForm.get('contrasena');
    if (registercontrolContrasena) {
      return registercontrolContrasena.hasError('required');
    }
    return false
  }

  get RegisterConfirmarContrasenaInvalido(): boolean{
    const registercontrolConfirmarContrasena = this.loginForm.get('ConfirmarContrasena');
    if (registercontrolConfirmarContrasena) {
      return registercontrolConfirmarContrasena.hasError('required');
    }
    return false
  }

  get FormInvalid(): boolean {
    return this.loginForm.valid;
  }

  createUser(registro: Registro){
    this.authService.createUserInFirestore(registro).then(() => {
      console.log("Usuario se registro exitosamente");
      
    }).catch((error) => {
      console.log('Ha ocurrido un error a registrarse', error);
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const login: Registro = {
        uid: '',
        nombreapellido: this.loginForm?.get('nombreapellido')?.value,
        email: this.loginForm?.get('email')?.value,
        contrasena: this.loginForm?.get('contrasena')?.value,
        ConfirmarContrasena: this.loginForm?.get('ConfirmarContrasena')?.value,

      }
      this.authService.registerUserWithEmailAndPassword(login).then((result) => {
        console.log("Usuario se registro exitosamente");
        login.uid = result.user.uid;
        this.createUser(login)
        this.router.navigate(['/Login'])
      }).catch((error) => {
        console.log('Ha ocurrido un error a registrarse', error);
      })
    }
  }

  

 
}
