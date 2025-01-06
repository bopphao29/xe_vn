import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

export const VEHICLE_ROUTES: Routes = [
  {
    path: 'vehicle',
    loadComponent: () =>
      import('./page-routing/page-routing.component').then(
        (c) => c.PageRoutingComponent
      ),
    children: [
      {
        path: 'setup-vehicle',
        loadComponent: () =>
          import(
            './page-routing/setup-profile-car/setup-profile-car.component'
          ).then((c) => c.SetupProfileCarComponent),
      },
      {
        path: 'profile-vehicle-management',
        loadComponent: () =>
          import(
            './page-routing/profile-vehicle-management/file-vehical-management.component'
          ).then((c) => c.FileVehicalManagementComponent),
      },
      {
        path: 'maintenance-repair',
        loadComponent: () =>
          import(
            './page-routing/maintenance-and-repair/maintenance-and-repair.component'
          ).then((c) => c.MaintenanceAndRepairComponent),
        children: [
          {
            path: 'setup-request-mr',
            loadComponent: () =>
              import(
                './page-routing/maintenance-and-repair/setup-request-mr/setup-request-mr.component'
              ).then((c) => c.SetupRequestMrComponent),
          },
          {
            path: 'list-request-mr',
            loadComponent: () =>
              import(
                './page-routing/maintenance-and-repair/list-request-mr/list-request-mr.component'
              ).then((c) => c.ListRequestMrComponent),
          },
          {
            path: 'report-request-mr',
            loadComponent: () =>
              import(
                './page-routing/maintenance-and-repair/report-request-mr/report-request-mr.component'
              ).then((c) => c.ReportRequestMrComponent),
          },
        ],
      },
      {
        path: 'deep-interior-cleaning',
        loadComponent: () =>
          import(
            './page-routing/deep-interior-cleaning/deep-interior-cleaning.component'
          ).then((c) => c.DeepInteriorCleaningComponent),
          children: [
            {
              path: 'setup-deep-cleaning',
              loadComponent: () =>
                import('./page-routing/deep-interior-cleaning/page/setup-deep-cleaning/setup-deep-cleaning.component').then(
                  (c) => c.SetupDeepCleaningComponent
                )
            },{
              path : 'list-deep-cleaning',
              loadComponent : () =>
                import('./page-routing/deep-interior-cleaning/page/list-deep-cleaning/list-deep-cleaning.component').then(
                  (c) => c.ListDeepCleaningComponent
                )
            },
            {
              path: 'report-deep-cleaning',
              loadComponent: () => 
                import('./page-routing/deep-interior-cleaning/page/report-deep-cleaning/report-deep-cleaning.component').then(
                  (c) => c.ReportDeepCleaningComponent
                )
            }
          ]
      },
      {
        path: 'operational-management',
        loadComponent: () =>
          import(
            './page-routing/operational-management/operational-management.component'
          ).then((c) => c.OperationalManagementComponent),
      },
      {
        path: 'operater-time-management',
        loadComponent: () =>
          import(
            './page-routing/operater-time-management/operater-time-management.component'
          ).then((c) => c.OperaterTimeManagementComponent),
      },
      {
        path: 'fuel-anagement',
        loadComponent: () =>
          import('./page-routing/fuel-anagement/fuel-anagement.component').then(
            (c) => c.FuelAnagementComponent
          ),
      },
    ],
  },
  {
    path: 'detail-vehicle/:id',
    loadComponent: () =>
      import('./detail-vehicle/detail-vehical.component').then(
        (c) => c.DetailVehicalComponent
      ),
  },
  {
    // path: 'detail-vehical/:id',
    path: 'vehicle/detail-mr/:id',
    loadComponent: () =>
      import('./detail-request-mr/detail-request-mr.component').then(
        (c) => c.DetailRequestMrComponent
      ),
  },
  {
    path: 'vehicle/detail-mr-change/:id',
    loadComponent: () =>
      import(
        './page-routing/maintenance-and-repair/setup-request-mr/setup-request-mr.component'
      ).then((c) => c.SetupRequestMrComponent),
  },
  {
    path: 'vehicle/detail-report-mr/:id',
    loadComponent: () =>
      import('./detail-report-mr/detail-report-mr.component').then(
        (c) => c.DetailReportMrComponent
      ),
  },
  {
    path: 'vehicle/detail-mr-complete/:id',
    loadComponent: () =>
      import(
        './page-routing/maintenance-and-repair/setup-request-mr/setup-request-mr.component'
      ).then((c) => c.SetupRequestMrComponent),
  },
];
