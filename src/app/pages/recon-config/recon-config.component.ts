import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-recon-config',
  standalone: true,
  imports     : [PageLayoutComponent, NgIf, ProgressBarComponent,ReactiveFormsModule, NgSelectModule ],
  templateUrl: './recon-config.component.html',
  styleUrl: './recon-config.component.scss'
})
export class ReconConfigComponent {
  glReconConfigForm!: FormGroup;
  divisions: string[] = ['PepsiCo Div 1', 'PepsiCo Div 2', 'PepsiCo Div 3'];
  bankTransactions = [
    { id: 1, name: 'Transaction 1' },
    { id: 2, name: 'Transaction 2' },
    { id: 3, name: 'Transaction 3' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.glReconConfigForm = this.fb.group({
      division: ['', Validators.required],
      accountAnalysis: [[], Validators.required], // Multi-select list
      section1: [],
      section2: [],
      section3: [],
      accountSection: [],
    });
  }

  onSubmit(): void {
    if (this.glReconConfigForm.valid) {
      console.log('Form Submitted', this.glReconConfigForm.value);
      // Handle the form submission logic here
    }
  }
}
