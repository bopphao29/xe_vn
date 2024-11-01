import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ROUTERS } from './shared/constants/router.const';
import { authGuard } from './core/auth.guard';
import { HOME_ROUTES } from './pages/home/home.routes';
import { EMPLOYEE_MANAGEMENT_ROUTES } from './pages/employee-management/employee-management.routes';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // {path: '', redirectTo: ROUTERS.HOME_DEFAULT, pathMatch: 'full'},
      {
        path: '',
        loadComponent: () => 
        (
          import('./pages/employee-management-default/employee-management-default.component').then(
            (c)=> c.EmployeeManagementDefaultComponent
          )
        )
      },
      {
        path: ROUTERS.DETAIL_EMPLOYEE,
        loadComponent: () => 
        (
          import('./pages/detail-profile-employee/detail-profile-employee.component').then(
            (c)=> c.DetailProfileEmployeeComponent
          )
        )
      },
      ...EMPLOYEE_MANAGEMENT_ROUTES,
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
