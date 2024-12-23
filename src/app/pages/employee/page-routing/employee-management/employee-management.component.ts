import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { RouterModule, NavigationEnd, RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routerLink } from '../../../../shared/services/router-link.service';


@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [

    FormsModule,
    TranslateModule,
    NzTabsModule,
    NzRadioModule,
    CommonModule,
    RouterModule
    // SetupProfileEmployeeComponent,
    // ListProfileEmployeeComponent,
    // ListEmployeeProbationComponent,
  ],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit{

  activeLink : string ='employeeManagement'

  routerString : string =''
  constructor (
    private routes: Router,
    private routerEmployeeList : routerLink
    
  ){}

  ngOnInit(): void {
    this.routerEmployeeList.data.subscribe((response: any)=> {
      this.routerString = response
      const savedLink = localStorage.getItem('activeLink')
      this.activeLink = savedLink ? savedLink : this.routerString
    })
    this.navigatePage()

    this.updateActiveLink(this.routes.url);

    // Lắng nghe sự thay đổi của router
    this.routes.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveLink(event.urlAfterRedirects);
      }
    });

  }


  updateActiveLink(url: string): void {
    const currentLink = this.listActiveLink.find(item => url.includes(item.router));
    if (currentLink) {
      this.activeLink = currentLink.actLink;
    } else {
      console.warn('No matching active link found for URL:', url);
      this.activeLink = ''; // Hoặc xử lý giá trị mặc định nếu cần
    }
  }
  

  navigatePage() {
    const currentLink = this.listActiveLink.find(item => item.actLink === this.activeLink);
    if (currentLink) {
      this.routes.navigate([currentLink.router]);
    } else {
      console.error('Invalid activeLink:', this.activeLink);
    }
  }
  

  romoveSearchEmployee(){
     const localValue = localStorage.getItem('activeLink')
    //  console.log(localValue)
    if(this.activeLink != localValue){
      localStorage.removeItem('search')
    }
  }

  listActiveLink = [
    {id : 1, actLink: 'employeeManagement', router: 'employee/setup-profile-employee'},
    {id : 2, actLink: 'employeeProfile', router: 'employee/list-employee-profile'},
    {id : 3, actLink: 'employeeeProbation', router: 'employee/list-employee-probation'},
    {id : 4, actLink: 'employeeViolatesDiscipline', router: 'employee/list-employee-violates-discipline'},
    {id : 5, actLink: 'employeeResign', router: 'employee/list-employee-resign'},
    {id : 6, actLink: 'employeeSalarySetup', router: 'employee/employee-salary-setup'},

  ]
  
  routerLink(actLink: string, router: string){
    this.activeLink = actLink
    this.romoveSearchEmployee();
    localStorage.setItem('activeLink', this.activeLink);
    this.routes.navigate([router])
  }
}
