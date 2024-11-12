import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEmployeeViolateComponent } from './detail-employee-violate.component';

describe('DetailEmployeeViolateComponent', () => {
  let component: DetailEmployeeViolateComponent;
  let fixture: ComponentFixture<DetailEmployeeViolateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailEmployeeViolateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEmployeeViolateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
