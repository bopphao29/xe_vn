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
        path: 'table-referee',
        loadComponent: () =>
          import('./table-referee/table-referee.component').then(
            (c) => c.TableRefereeComponent
          ),
      },
      {
        path: 'setup-table-referee',
        loadComponent: () =>
          import('./setup-table-referee/setup-table-referee.component').then(
            (c) => c.SetupTableRefereeComponent
          ),
      },
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
      {
        path: 'vehicle-command',
        loadComponent: () =>
          import('.//vehicle-command/vehicle-command.component').then(
            (c) => c.VehicleCommandComponent
          ),
        children: [
          {
            path: '',
            redirectTo: 'extend',
            pathMatch: 'full',
          },
          {
            path: 'extend',
            loadComponent: () =>
              import('./vehicle-command/extend/extend.component').then(
                (c) => c.ExtendVehicleComponent
              ),
          },
          {
            path: 'tour',
            loadComponent: () =>
              import('./vehicle-command/tour/tour.component').then(
                (c) => c.TourVehicleComponent
              ),
          },
        ],
      },
      {
        path: 'setup-fuel-price',
        loadComponent: () =>
          import('./setup-fuel-price/setup-fuel-price.component').then(
            (c) => c.SetupFuelPriceComponent
          ),
      },
      {
        path: 'work-schedule',
        loadComponent: () =>
          import('./work-schedule/work-schedule.component').then(
            (c) => c.WorkScheduleComponent
          ),
      },
      {
        path: 'fix-schedule',
        loadComponent: () =>
          import('./fix-schedule/fix-schedule.component').then(
            (c) => c.FixScheduleComponent
          ),
      },
      {
        path: 'setup-norm',
        loadComponent: () =>
          import('./setup-norm/setup-norm.component').then(
            (c) => c.SetupNormComponent
          ),
      },
    ],
  },
];
