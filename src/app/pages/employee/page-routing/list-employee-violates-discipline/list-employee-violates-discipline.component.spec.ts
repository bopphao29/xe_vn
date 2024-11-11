import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeeViolatesDisciplineComponent } from './list-employee-violates-discipline.component';

describe('ListEmployeeViolatesDisciplineComponent', () => {
  let component: ListEmployeeViolatesDisciplineComponent;
  let fixture: ComponentFixture<ListEmployeeViolatesDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEmployeeViolatesDisciplineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEmployeeViolatesDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
