// app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ClienteComponent } from './cliente/cliente';
import { Venta } from './venta/venta';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './security/auth.guard';
import { ProductoComponent } from './producto/producto.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'venta', component: Venta, canActivate: [AuthGuard] },
  { path: 'producto', component: ProductoComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];
