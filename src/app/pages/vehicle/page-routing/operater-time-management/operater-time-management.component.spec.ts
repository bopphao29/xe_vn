import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperaterTimeManagementComponent } from './operater-time-management.component';

describe('OperaterTimeManagementComponent', () => {
  let component: OperaterTimeManagementComponent;
  let fixture: ComponentFixture<OperaterTimeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperaterTimeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperaterTimeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
