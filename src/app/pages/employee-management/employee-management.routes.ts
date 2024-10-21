import { Routes } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management.component';
import { authGuard } from '../../core/auth.guard';

export const EMPLOYEE_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'employee-management',
    loadComponent: () => 
    import('./employee-management.component').then(
        (c) => c.EmployeeManagementComponent
    ),
  },
];
