import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepInteriorCleaningComponent } from './deep-interior-cleaning.component';

describe('DeepInteriorCleaningComponent', () => {
  let component: DeepInteriorCleaningComponent;
  let fixture: ComponentFixture<DeepInteriorCleaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepInteriorCleaningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeepInteriorCleaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
