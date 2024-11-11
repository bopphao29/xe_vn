import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
// import { ListProfileEmployeeComponent } from './list-profile-employee/list-profile-employee.component';
// import { DetailProfileEmployeeComponent } from './detail-profile-employee/detail-profile-employee.component';
// import { SetupProfileEmployeeComponent } from './setup-profile-employee/setup-profile-employee.component';
// import { ListEmployeeProbationComponent } from './list-employee-probation/list-employee-probation.component';

export const EMPPLOYEE_ROUTES: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'employee-managament',
  //   pathMatch: 'full'
  // },
  {
    path: 'employee',
    loadComponent: () =>
      import('./page-routing/page-routing.component').then(
        (c) => c.PageRoutingComponent
      ),
    children: [
      {
        path: 'list-employee-probation',
        loadComponent: () =>
          import('./page-routing/list-employee-probation/list-employee-probation.component').then(
            (c) => c.ListEmployeeProbationComponent
          )

      },
      // },
      {
        path: 'employee-management',
        loadComponent: () =>
          import('./page-routing/setup-profile-employee/setup-profile-employee.component').then(
            (c) => c.SetupProfileEmployeeComponent
          ),
      },
      {
        path: 'list-employee-profile',
        loadComponent: () => 
        import('./page-routing/list-profile-employee/list-profile-employee.component').then(
            (c) => c.ListProfileEmployeeComponent
        ),
      },
      {
        path: 'list-employee-violates-discipline',
        loadComponent: () => 
        import('./page-routing/list-employee-violates-discipline/list-employee-violates-discipline.component').then(
            (c) => c.ListEmployeeViolatesDisciplineComponent
        ),
      },
    ]

  },
  // {
  //   path: 'list-employee-probation',
  //   loadComponent: () => 
  //     import('./list-employee-probation/list-employee-probation.component').then(
  //       (c) => c.ListEmployeeProbationComponent
  //     )

  // },
  // {
  //   path: 'employee-management',
  //   loadComponent: () => 
  //   import('./setup-profile-employee/setup-profile-employee.component').then(
  //       (c) => c.SetupProfileEmployeeComponent
  //   ),
  // },
  {
    path: 'detail-employee/:id',
    loadComponent: () =>
      import('./detail-profile-employee/detail-profile-employee.component').then(
        (c) => c.DetailProfileEmployeeComponent
      ),
  },
  // {
  //   path: 'employee-managament',
  //   loadComponent: () => 
  //   import('./setup-profile-employee/setup-profile-employee.component').then(
  //       (c) => c.SetupProfileEmployeeComponent
  //   ),
  // },
]
