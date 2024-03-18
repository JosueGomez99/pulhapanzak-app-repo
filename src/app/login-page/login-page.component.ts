import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup,  ReactiveFormsModule,  Validators} from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonRouterLink, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IniciarSesion } from '../services/auth/models/iniciar-sesion'
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonIcon,
    RouterLink, 
    IonRouterLink,
    RouterModule,
  ]
})
export class LoingPageComponent {
  private _router = inject(Router)
  private _authService = inject(AuthService)  
  private formBuilder = inject(FormBuilder);
  
  LoginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required]
  })

  get LoginEmailInvalido(): boolean{
    const control_loginEmail = this.LoginForm.get('email');
    if (control_loginEmail) {
      return control_loginEmail.hasError('email')
    }
    return false
  }

  get LoginPasswordInvalido(): boolean{
    const control_loginPassword = this.LoginForm.get('contrasena');
    if (control_loginPassword) {
      return control_loginPassword.hasError('required')
    }
    return false
  }

  get LoginInvalid(): boolean{
    return this.LoginForm.valid;
  }

  onSubmit(): void {
    if (this.LoginForm.valid) {
      const login: IniciarSesion = {
        email: this.LoginForm?.get('email')?.value,
        contrasena: this.LoginForm?.get('contrasena')?.value,
      }
      this._authService.signInWithEmailAndPassword(login).then(() => {
        console.log('Usuario entro exitosamente')
        this._router.navigate(['/Perfil'])
      }).catch((error) => {
        console.log('Ha ocurrido un error al hacer login');
        console.log(error);
      });
    }
  }  

  constructor() { }

  

}
