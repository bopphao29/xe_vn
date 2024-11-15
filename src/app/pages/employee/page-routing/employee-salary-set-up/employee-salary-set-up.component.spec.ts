import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalarySetUpComponent } from './employee-salary-set-up.component';

describe('EmployeeSalarySetUpComponent', () => {
  let component: EmployeeSalarySetUpComponent;
  let fixture: ComponentFixture<EmployeeSalarySetUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalarySetUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalarySetUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
