import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconReportComponent } from './recon-report.component';

describe('ReconReportComponent', () => {
  let component: ReconReportComponent;
  let fixture: ComponentFixture<ReconReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReconReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
