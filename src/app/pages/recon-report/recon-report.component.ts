import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';

@Component({
  selector: 'app-recon-report',
  standalone: true,
  imports     : [PageLayoutComponent, NgIf, ProgressBarComponent,ReactiveFormsModule, NgFor ],
  templateUrl: './recon-report.component.html',
  styleUrl: './recon-report.component.scss'
})
export class ReconReportComponent {

  runReportForm!: FormGroup;
  reports: Array<{ name: string, description: string, status: string }> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initializing the form with form controls
    this.runReportForm = this.fb.group({
      division: ['', Validators.required],
      fundingPeriod: ['', Validators.required],
    });

    // Dummy reports data, replace with your actual data source
    this.reports = [
      { name: 'Report 1', description: 'Description for Report 1', status: 'Pending' },
      { name: 'Report 2', description: 'Description for Report 2', status: 'Completed' },
      { name: 'Report 3', description: 'Description for Report 3', status: 'Failed' }
    ];
  }

  // Handle form submission
  onSubmit(): void {
    if (this.runReportForm.valid) {
      const formData = this.runReportForm.value;
      console.log('Form submitted successfully!', formData);

      // Call your API or service to run the reports based on form data
    } else {
      console.log('Form is invalid');
    }
  }

  // Run a specific report
  runReport(report: { name: string, description: string, status: string }): void {
    console.log(`Running report: ${report.name}`);
    
    // Logic to run the report (e.g., make an API call or trigger a process)
    report.status = 'Running'; // Update report status temporarily
  }
}
