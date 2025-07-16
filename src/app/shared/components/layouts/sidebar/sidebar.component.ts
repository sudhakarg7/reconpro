import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface IMenuList {
  id: number;
  icon: string;
  title: string;
  route?: string;
  children?: IMenuList[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf, NgClass],
})
export class SidebarComponent implements OnInit {
  menuList: IMenuList[] = [];
  openSubMenuId: number | null = null; // To track the open submenu
  public isCollapsed = false;

  ngOnInit(): void {
    this.menuList = [
      {
        id: 1,
        icon: 'nav-icon i-Bar-Chart',
        title: 'Dashboard',
        route: '/home',
      },
      {
        id: 2,
        icon: 'nav-icon i-Data-Settings',
        title: 'Config',
        children: [
          {
            id: 21,
            icon: 'nav-icon i-Building',
            title: 'Client Config',
            route: '/client-config',
          },
          {
            id: 22,
            icon: 'nav-icon i-Data-Settings',
            title: 'Recon Config',
            route: '/recon-config',
          },
        ],
      },
      {
        id: 3,
        icon: 'nav-icon i-Upload',
        title: 'Upload',
        route: '/upload-files',
      },
      {
        id: 4,
        icon: 'nav-icon i-File-Cloud',
        title: 'Reports',
        children: [
          {
            id: 41,
            icon: 'nav-icon i-File-Cloud',
            title: 'Recon Report',
            route: '/recon-reports',
          },
        ],
      },
      {
        id: 5,
        icon: 'nav-icon i-Add-User',
        title: 'Profile',
        children: [
          {
            id: 51,
            icon: 'nav-icon i-Add-User',
            title: 'Create Profile',
            route: '/create-profile',
          },
          {
            id: 52,
            icon: 'nav-icon i-Find-User',
            title: 'View Profile',
            route: '/view-profile',
          },
        ],
      },
    ];
  }

  // Track by function for performance optimization
  trackById(index: number, item: IMenuList): number {
    return item.id;
  }

  //   // Toggle submenu open/close state
  //   toggleSubMenu(id: number): void {
  //     if (this.openSubMenuId === id) {
  //       this.openSubMenuId = null; // Close the submenu if already open
  //     } else {
  //       this.openSubMenuId = id; // Open the clicked submenu
  //     }
  //   }

  //   // Check if submenu is open
  //   isSubMenuOpen(id: number): boolean {
  //     return this.openSubMenuId === id;
  //   }

  toggleSubMenu(id: number): void {
    if (this.openSubMenuId === id) {
      this.openSubMenuId = null; // Close the submenu if already open
    } else {
      this.openSubMenuId = id; // Open the clicked submenu
    }
  }

  isSubMenuOpen(id: number): boolean {
    return this.openSubMenuId === id;
  }
}
