import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { ProductsComponent } from './componentes/cultivos/cultivos.component';
import { OrdersComponent } from './componentes/zonas/zonas.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistrarseComponent } from './componentes/registrarse/registrarse.component';
import { DetalleComponent } from './componentes/detalle/detalle.component';
import { SettingComponent } from './componentes/plagas/plaga.component';
import { Noauth } from './services/guards/noauth.guard';
import { AuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent, canActivate: [AuthGuard],
    children:[
      {path: 'cultivos',component:ProductsComponent, canActivate: [AuthGuard]},
      {path: 'zonas',component:OrdersComponent, canActivate: [AuthGuard]},
      {path: 'plagas',component:SettingComponent, canActivate: [AuthGuard]},
      {path: 'details/:id',component:DetalleComponent, canActivate: [AuthGuard]},
    ]
  },
  {
    path: 'login',
    component: LoginComponent,canActivate: [Noauth]
  },
  {
    path: 'registrarse',
    component: RegistrarseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
