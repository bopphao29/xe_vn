import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailReportDclComponent } from './detail-report-dcl.component';

describe('DetailReportDclComponent', () => {
  let component: DetailReportDclComponent;
  let fixture: ComponentFixture<DetailReportDclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailReportDclComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailReportDclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
