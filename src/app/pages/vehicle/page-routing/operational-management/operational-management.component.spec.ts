import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalManagementComponent } from './operational-management.component';

describe('OperationalManagementComponent', () => {
  let component: OperationalManagementComponent;
  let fixture: ComponentFixture<OperationalManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationalManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
