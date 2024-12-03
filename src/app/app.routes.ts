import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ROUTERS } from './shared/constants/router.const';
import { authGuard } from './core/auth.guard';
import { HOME_ROUTES } from './pages/home/home.routes';
import { EMPPLOYEE_ROUTES } from './pages/employee/employee-routing.module';
import { AUTHEN_ROUTES } from './pages/authen/authen.module'
import { VEHICLE_ROUTES } from './pages/vehicle/vehicle-routing.module';
import { LoginComponent } from './pages/authen/login/login.component';
// import { EMPLOYEE_MANAGEMENT_ROUTES } from './pages/employee/employee-management/employee-management.routes';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      ...EMPPLOYEE_ROUTES,
      ...VEHICLE_ROUTES,

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
  ...AUTHEN_ROUTES,
  {
    path: '**',
    redirectTo: ROUTERS.HOME_DEFAULT
  },
];
