import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeeResignComponent } from './list-employee-resign.component';

describe('ListEmployeeResignComponent', () => {
  let component: ListEmployeeResignComponent;
  let fixture: ComponentFixture<ListEmployeeResignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEmployeeResignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEmployeeResignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
