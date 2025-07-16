import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports     : [PageLayoutComponent, NgIf, ProgressBarComponent,ReactiveFormsModule,FormsModule, NgFor, CommonModule ],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {


  // List of profiles
  profiles = [
    {
      ahId: 'AH1234',
      name: 'John Doe',
      updatedBy: 'Admin',
      updatedOn: new Date('2024-09-01'),
    },
    {
      ahId: 'AH5678',
      name: 'Jane Smith',
      updatedBy: 'User',
      updatedOn: new Date('2024-08-25'),
    },
    {
      ahId: 'AH9101',
      name: 'Alex Johnson',
      updatedBy: 'Admin',
      updatedOn: new Date('2024-10-12'),
    },
  ];

  // Filtered profiles
  filteredProfiles:any = [];

  // Search query
  searchQuery: string = '';

  ngOnInit() {
    // Initialize filteredProfiles with all profiles
    this.filteredProfiles = [...this.profiles];
  }

  // Filter profiles based on AH ID or Name
  filterProfiles() {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredProfiles = this.profiles.filter(
        (profile) =>
          profile.ahId.toLowerCase().includes(query) ||
          profile.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredProfiles = [...this.profiles];
    }
  }

  // Clear the search filter
  clearFilter() {
    this.searchQuery = '';
    this.filteredProfiles = [...this.profiles];
  }
}
