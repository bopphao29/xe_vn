import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

export const OPERATION_ROUTES: Routes = [
  {
    path: 'operation',
    // redirectTo: 'operation/setup-operation',
    // pathMatch: 'full',
    loadComponent: () =>
      import('./operation.component').then((c) => c.OperationComponent),
    children: [
      {
        path: 'setup-operation',
        loadComponent: () =>
          import('./setup-operation/setup-operation.component').then(
            (c) => c.SetupOperationComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'route',
            pathMatch: 'full',
          },
          {
            path: 'route',
            loadComponent: () =>
              import('./setup-operation/route/route.component').then(
                (c) => c.SetupOperationRouteComponent
              ),
          },
          {
            path: 'place',
            loadComponent: () =>
              import('./setup-operation/place/place.component').then(
                (c) => c.SetupOperationPlaceComponent
              ),
          },
        ],
      },
    ],
  },
];
