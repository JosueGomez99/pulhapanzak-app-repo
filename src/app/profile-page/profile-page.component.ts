import { Component, OnInit, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRegistroService } from '../auth-registro/services/auth-registro.service';
import { Registro } from '../services/auth/models/registro';
import { ProfileService } from 'src/app/perfiles/perfil.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonThumbnail,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonImg
  ],
})
export class ProfilePageComponent implements OnInit {
  private authService = inject(AuthRegistroService);
  private formBuilder = inject(FormBuilder);
  private user: Registro | null = null;
  private profileService = inject(ProfileService);
  imageSrc: string = 'assets/16480.png';

  UserForm: FormGroup = this.formBuilder.group({
    nombreapellido: ['', Validators.required],
    numeroDNI: ['', [Validators.required, Validators.minLength(13)]],
    fechanacimiento: ['', Validators.required],
    numerotelefono: ['', [Validators.required, Validators.minLength(8)]],
    imagenperfil: [''],
  });
  

  get PerfilNombreApellidoInvalido(): boolean{
    const perfilcontrolNombreApellido = this.UserForm.get('nombreapellido');

    if (perfilcontrolNombreApellido) {
      return perfilcontrolNombreApellido.hasError('required');
      
    }
      return false;
  }

  get PerfilcontrolNumeroDNI(): boolean{
    const perfilcontrolNumeroDNI = this.UserForm.get('numeroDNI');

    if (perfilcontrolNumeroDNI) {
      return perfilcontrolNumeroDNI.hasError('minlength');
      
    }
      return false;
  }

  get PerfilcontrolFechaNacimiento(): boolean{
    const perfilcontrolFechaNacimiento = this.UserForm.get('fechanacimiento');

    if (perfilcontrolFechaNacimiento) {
      return perfilcontrolFechaNacimiento.hasError('required');
      
    }
      return false;
  }

  get PerfilcontrolNumeroTelefono(): boolean{
    const perfilcontrolNumeroTelefono = this.UserForm.get('numerotelefono');

    if (perfilcontrolNumeroTelefono) {
      return perfilcontrolNumeroTelefono.hasError('minlength');
      
    }
      return false;
  }
  

  get FormInvalid(): boolean {
    return this.UserForm.invalid;
  }

    getUserLoggued(): void {
    this.authService.getUserLogged().then((user: Registro | null) => {
      this.user = user;
      this.imageSrc = user?.imagenperfil ?? this.imageSrc;
      this.UserForm.patchValue({
        nombreapellido: this.user?.nombreapellido,
        numeroDNI: this.user?.numeroDNI,
        imagen: this.user?.imagenperfil,
        numerotelefono: this.user?.numerotelefono,
        fechanacimiento: this.user?.fechanacimiento
      });
    });
  }

  ngOnInit(): void {
    this.getUserLoggued()
  }

  onSubmit(): void {
    debugger;
    if (!this.FormInvalid && this.user) {
      this.user.nombreapellido = this.UserForm?.get('nombreapellido')?.value;
      this.user.numeroDNI = this.UserForm?.get('numeroDNI')?.value;
      this.user.fechanacimiento = this.UserForm?.get('fechanacimiento')?.value;
      this.user.numerotelefono = this.UserForm?.get('numerotelefono')?.value;
      this.profileService
      .uploadImage(this.imageSrc, this.user?.uid ?? '')
      .then((url) => {
        debugger;
        if (url) {

          if (this.user) this.user.imagenperfil = url;
        }
        this.saveUser();
        console.log("Se a guardado: ",this.saveUser());
      })
        .catch(() => {
          console.log("Ha ocurrido un error al cambiar su imagen de perfil, vuelva a intentarlo");
        });
    }
  }

  async pickImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      promptLabelHeader: 'Seleccionar una opción',
      promptLabelPicture: 'Tomar una foto',
      promptLabelPhoto: 'Elegir de galería',
    });

    if (!image) return;

    this.imageSrc = image.webPath ?? image.path ?? '';
  }

  saveUser(): void{
    if (this.user) {
      this.authService.updateUser(this.user)
      .then(() => {
        this.getUserLoggued();
        console.log("Usuario actualizado correctamente");
      })
      .catch((error) => {
        console.log("Ha ocurrido un error, vuelva a intentarlo", error);
      })
    }
  }

  private _authService = inject(AuthService);
  private _router = inject(Router);
  signOut() {
    this._authService
      .signout()
      .then(() => {
        console.log('Usuario ha cerrado la sesion exitosamente');
        this._router.navigate(['/Login']);
      })
      .catch((error) => {
        console.log('Ha ocurrido un error al cerrar sesion');
        console.log(error);
      });
  }

  constructor() {}
}