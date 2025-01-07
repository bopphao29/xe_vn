import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { routerLink } from '../../shared/services/router-link.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    CommonModule,
    RouterModule,
  ],
})
export class OperationComponent {
  activeLink: string = 'employeeManagement';

  routerString: string = '';
  constructor(private routes: Router, private routerEmployeeList: routerLink) {}

  ngOnInit(): void {
    this.routerEmployeeList.data.subscribe((response: any) => {
      this.routerString = response;
      const savedLink = localStorage.getItem('activeLink');
      this.activeLink = savedLink ? savedLink : this.routerString;
    });

    //default setup operation
    if (this.listActiveLink.length > 0) {
      this.activeLink = this.listActiveLink[2].actLink;
      localStorage.setItem('activeLink', this.listActiveLink[2].actLink);
      this.routes.navigate([this.listActiveLink[2].router]);
    }
  }

  updateActiveLink(url: string): void {
    const currentLink = this.listActiveLink.find((item) =>
      url.includes(item.router)
    );
    if (currentLink) {
      this.activeLink = currentLink.actLink;
    } else {
      console.warn('No matching active link found for URL:', url);
      this.activeLink = ''; // Hoặc xử lý giá trị mặc định nếu cần
    }
  }

  navigatePage() {
    const currentLink = this.listActiveLink.find(
      (item) => item.actLink === this.activeLink
    );
    if (currentLink) {
      this.routes.navigate([currentLink.router]);
    } else {
      console.error('Invalid activeLink:', this.activeLink);
    }
  }

  romoveSearchEmployee() {
    const localValue = localStorage.getItem('activeLink');
    if (this.activeLink != localValue) {
      localStorage.removeItem('search');
    }
  }

  listActiveLink = [
    {
      id: 1,
      actLink: 'table-referee',
      router: 'operation/table-referee',
    },
    {
      id: 2,
      actLink: 'setup-table-referee',
      router: 'operation/setup-table-referee',
    },
    {
      id: 3,
      actLink: 'setup-operation',
      router: 'operation/setup-operation',
    },
    {
      id: 4,
      actLink: 'vehicle-command',
      router: 'operation/vehicle-command',
    },
    {
      id: 5,
      actLink: 'work-schedule',
      router: 'operation/work-schedule',
    },
    {
      id: 6,
      actLink: 'fix-schedule',
      router: 'operation/fix-schedule',
    },
    {
      id: 7,
      actLink: 'setup-fuel-price',
      router: 'operation/setup-fuel-price',
    },
    {
      id: 8,
      actLink: 'setup-norm',
      router: 'operation/setup-norm',
    },
  ];

  routerLink(actLink: string, router: string) {
    this.activeLink = actLink;
    this.romoveSearchEmployee();
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate([router]);
  }
}
