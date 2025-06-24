import { Component, OnInit } from "@angular/core";
import { ApiAuthService } from "../services/apiauth.service";
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from "@angular/material/input";
import { MatInput } from "@angular/material/input";
import { MatLabel } from "@angular/material/input";
import{FormsModule} from '@angular/forms'; // Asegúrate de importar FormsModule si usas [(ngModel)]
import { Router } from "@angular/router";
import { FormGroup, FormControl , FormBuilder} from "@angular/forms";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule, // Asegúrate de importar FormsModule si usas [(ngModel)]
    ReactiveFormsModule,
   
  ],
  standalone: true,
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {


  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
      public apiauthService: ApiAuthService,
      private router: Router
  ) {
      /*if(this.apiauthService.usuarioData)
        {
          this.router.navigate(['/']); // Redirige al usuario si ya está autenticado

      }*/
      
    }
    ngOnInit(): void {
      // Este método se ejecuta al inicializar el componente
      console.log('LoginComponent inicializado');
    }

    login() {
      console.log('Inicio de sesión enviado:', this.loginForm.value);
      // estamos instacionado en dos variables 
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';
      //mandamos esas dos variables a login
      this.apiauthService.login({ email, password }).subscribe(response => {
  if (response.exito === 1) {
    console.log("Login exitoso. Navegando al home...");
    this.router.navigate(['/']);
  } else {
    console.log("Login fallido:", response);
  }
});

  }
  }