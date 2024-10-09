import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ROUTERS } from './shared/constants/router.const';
import { authGuard } from './core/auth.guard';
import { HOME_ROUTES } from './pages/home/home.routes';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', redirectTo: ROUTERS.HOME_DEFAULT, pathMatch: 'full'},
      {
        path: ROUTERS.HOME_DEFAULT,
        loadComponent: () => 
        import('./pages/home-default/home-default.component').then(
            (c) => c.HomeDefaultComponent
        )
      },
      ...HOME_ROUTES
    ],
  },
  {
    path: ROUTERS.LOGIN,
    loadComponent: () => 
      import('./pages/login/login.component').then(
        (c) => c.LoginComponent
      )
  },
  {
    path: '**',
    redirectTo: ROUTERS.HOME_DEFAULT
  },
];
