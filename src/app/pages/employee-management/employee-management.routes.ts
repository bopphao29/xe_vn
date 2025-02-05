import { Routes } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management.component';
import { authGuard } from '../../core/auth.guard';
import { DetailProfileEmployeeComponent } from '../detail-profile-employee/detail-profile-employee.component';

export const EMPLOYEE_MANAGEMENT_ROUTES: Routes = [
  {
    path: 'employee-management',
    loadComponent: () => 
    import('./employee-management.component').then((c) => c.EmployeeManagementComponent),
  },
  {
    // path: 'employee-management/:id',
    path: 'employee-management/1',
    component: DetailProfileEmployeeComponent
  }
  
];
