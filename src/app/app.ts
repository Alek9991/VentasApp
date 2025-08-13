import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router'; // 👈 agrega RouterModule
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from './models/usuario';
import { ApiAuthService } from './services/apiauth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

//dashboard
import { MatToolbarModule } from '@angular/material/toolbar';




//////////////////////


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule, 
    MatSidenavModule,
    MatDialogModule,     
    MatButtonModule,     
    MatInputModule,      
    MatSnackBarModule,   
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
    
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title = 'app';
   usuario: Usuario | null = null;

   isDarkMode: boolean = false;



constructor(public apiauthService: ApiAuthService,
                    private router: Router 

  ){
      this.apiauthService.usuario.subscribe(res=>{
        this.usuario=res;
        console.log("cambio el objeto:", res);

      })
  }
  logout(){
    this.apiauthService.logout();
    this.router.navigate(['/login']); 
  }


  //  toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  //   document.body.classList.toggle('dark-mode', this.isDarkMode);
 
  
  // }


  toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-mode', this.isDarkMode);

  const overlayContainer = document.querySelector('.cdk-overlay-container');
  if (overlayContainer) {
    if (this.isDarkMode) {
      overlayContainer.classList.add('dark-mode');
    } else {
      overlayContainer.classList.remove('dark-mode');
    }
  }
}

  chartOptions = {
  chart: {
    background: 'transparent',
    foreColor: this.isDarkMode ? '#e0e0e0' : '#333'
  },
  theme: {
    mode: this.isDarkMode ? 'dark' : 'light'
  }
};

}
