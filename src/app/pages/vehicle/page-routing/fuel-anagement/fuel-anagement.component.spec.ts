import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelAnagementComponent } from './fuel-anagement.component';

describe('FuelAnagementComponent', () => {
  let component: FuelAnagementComponent;
  let fixture: ComponentFixture<FuelAnagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelAnagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelAnagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
