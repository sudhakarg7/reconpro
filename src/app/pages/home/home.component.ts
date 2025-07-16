// Angular modules
import { NgIf, NgFor, NgClass }                 from '@angular/common';
import { Component,ViewChild  }            from '@angular/core';
import { OnInit }               from '@angular/core';

// Services
import { StoreService }         from '@services/store.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent }  from '@layouts/page-layout/page-layout.component';


import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, BarController, BarElement, registerables  } from 'chart.js';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);


@Component({
  selector    : 'app-home',
  templateUrl : './home.component.html',
  styleUrls   : ['./home.component.scss'],
  standalone  : true,
  imports     : [PageLayoutComponent, NgIf, NgFor, NgClass, ProgressBarComponent, BaseChartDirective, FormsModule ]
})
export class HomeComponent implements OnInit
{
  constructor
  (
    public storeService : StoreService,
    private http:HttpClient
  )
  { 
    Chart.register(...registerables);
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  {
    setTimeout(_ =>
    {
      this.storeService.isLoading.set(false);
    }, 2000);
    this.updatePagedBackupTableData();
    this.onGlSummaryFilterChange(this.glSummaryFilter);
    this.onBarChartFilterChange(this.barChartFilter);
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private getThemeColor(varName: string, fallback: string): string {
    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(varName);
    return value ? value.trim() : fallback;
  }

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#888', font: { size: 13, family: 'Inter, Roboto, Segoe UI, Arial, sans-serif' } },
      },
      y: {
        grid: { color: '#e3e3e3' },
        ticks: { color: '#888', font: { size: 13, family: 'Inter, Roboto, Segoe UI, Arial, sans-serif' }, stepSize: 500 },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 16,
          boxHeight: 16,
          padding: 18,
          font: { size: 14, family: 'Inter, Roboto, Segoe UI, Arial, sans-serif' },
          color: '#222',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: '#1976d2',
        bodyColor: '#222',
        borderColor: '#e3e3e3',
        borderWidth: 1,
        titleFont: { size: 14, family: 'Inter, Roboto, Segoe UI, Arial, sans-serif' },
        bodyFont: { size: 13, family: 'Inter, Roboto, Segoe UI, Arial, sans-serif' },
      },
    },
    backgroundColor: '#fff',
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false
      },
    },
  };
  public barChartType = 'bar' as const;

  // Updated to reflect your payroll data
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2346, 2566, 1346, 2346, 2346, 2346],
        label: 'Clear Status',
        backgroundColor: this.getThemeColor('--bs-success-flat', '#6ee7b7'),
        maxBarThickness: 32
      },
      {
        data: [120, 40, 100, 50, 210, 60],
        label: 'Out Status',
        backgroundColor: this.getThemeColor('--bs-danger-flat', '#f87171'),
        maxBarThickness: 32
      }
    ],
  };

  // Chart events
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    console.log(event, active);
  }

  // Randomize data function
  public randomize(): void {
    // Only Change 3 values for example purposes
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56
    ];

    this.chart?.update();
  }
  


  // GL Summary  chart

  // Doughnut chart options
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  // Doughnut chart data
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Payroll', 'Funding', 'Total'],
    datasets: [
      {
        data: [5340917.80, 5139574.88, -826718.16], // Example data
        backgroundColor: ['#63f3be', '#49a2eb', '#FFCE56'], // Different colors for segments
        hoverBackgroundColor: ['#63f3be', '#49a2eb', '#FFCE56']
      }
    ]
  };

  public doughnutChartType = 'doughnut' as const;

  // GL Summary filter
  public glSummaryFilter: 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  // Example data for each filter type
  private glSummaryData = {
    monthly: {
      labels: ['Payroll', 'Funding', 'Total'],
      data: [5340917.80, 5139574.88, -826718.16]
    },
    quarterly: {
      labels: ['Payroll Q1', 'Funding Q1', 'Total Q1'],
      data: [12000000, 11000000, 1000000]
    },
    yearly: {
      labels: ['Payroll Y', 'Funding Y', 'Total Y'],
      data: [48000000, 45000000, 3000000]
    }
  };

  onGlSummaryFilterChange(filter: 'monthly' | 'quarterly' | 'yearly') {
    this.glSummaryFilter = filter;
    const selected = this.glSummaryData[filter];
    this.doughnutChartData = {
      labels: selected.labels,
      datasets: [
        {
          data: selected.data,
          backgroundColor: ['#63f3be', '#49a2eb', '#FFCE56'],
          hoverBackgroundColor: ['#63f3be', '#49a2eb', '#FFCE56']
        }
      ]
    };
  }

  // Bar Chart filter
  public barChartFilter: 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  // Example data for each filter type
  private barChartDataSets = {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      clear: [2346, 2566, 1346, 2346, 2346, 2346],
      out: [120, 40, 100, 50, 210, 60]
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      clear: [7000, 8000, 7500, 8200],
      out: [260, 180, 200, 220]
    },
    yearly: {
      labels: ['2023', '2024', '2025'],
      clear: [32000, 34000, 36000],
      out: [900, 850, 950]
    }
  };

  onBarChartFilterChange(filter: 'monthly' | 'quarterly' | 'yearly') {
    this.barChartFilter = filter;
    const selected = this.barChartDataSets[filter];
    this.barChartData = {
      labels: selected.labels,
      datasets: [
        {
          data: selected.clear,
          label: 'Clear Status',
          backgroundColor: this.getThemeColor('--bs-success-flat', '#6ee7b7'),
          maxBarThickness: 32
        },
        {
          data: selected.out,
          label: 'Out Status',
          backgroundColor: this.getThemeColor('--bs-danger-flat', '#f87171'),
          maxBarThickness: 32
        }
      ]
    };
  }

  downloadFile() {
    const fileUrl = 'assets/Eproceedings.csv'; // Replace with your actual file URL
    this.downloadExcelFile(fileUrl);
  }
  downloadExcelFile(url: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob:any) => {
      const newBlob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      link.target = '_blank'; // Open in new tab
      link.download = 'test.csv'; // Set the file name
      
      // Automatically click the link to trigger the download
      link.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }

  // -------------------------------------------------------------------------------
  // NOTE Table Data for Backup Tables (NEW) ---------------------------------------
  // -------------------------------------------------------------------------------

  public backupTableData = [
    {
      year: '2025',
      month: 'May',
      inputData: 'Monthly Data',
      backupTable1: 'Net Pay Table A',
      backupTable2: 'Net Pay Table B',
      backupTable3: 'Check Net Pay C',
      backupTable3Duplicate: 'Ded Value H',
      backupTable4: 'Reverse Net I',
      clearStatus: { value: '50/200', file: 'clear-may.xlsx' },
      outStatus: { value: '150/200', file: 'out-may.xlsx' },
      status: false
    },
    {
      year: '2025',
      month: 'April',
      inputData: 'Monthly Data',
      backupTable1: 'Net Pay Table A',
      backupTable2: 'Net Pay Table B',
      backupTable3: 'Check Net Pay C',
      backupTable3Duplicate: 'Ded Value H',
      backupTable4: 'Reverse Net I',
      clearStatus: { value: '50/200', file: 'clear-april.xlsx' },
      outStatus: { value: '150/200', file: 'out-april.xlsx' },
      status: false
    },
    {
      year: '2025',
      month: 'March',
      inputData: 'Monthly Data',
      backupTable1: 'Net Pay Table A',
      backupTable2: 'Net Pay Table B',
      backupTable3: 'Check Net Pay C',
      backupTable3Duplicate: 'Ded Value H',
      backupTable4: 'Reverse Net I',
      clearStatus: { value: '50/200', file: 'clear-march.xlsx' },
      outStatus: { value: '150/200', file: 'out-march.xlsx' },
      status: false
    }
  ];

  // Toggle status for a row
  public toggleStatus(row: any): void {
    row.status = !row.status;
  }

  // Download Excel for a specific row/column
  public downloadStatusExcel(fileName: string): void {
    // In a real app, you would generate or fetch the file dynamically
    // For demo, just trigger download from assets (ensure files exist or handle 404)
    const fileUrl = `assets/${fileName}`;
    this.downloadExcelFile(fileUrl);
  }

  public showInputDataModal = false;
  public inputDataTable: any[] = [];
  public pagedInputDataTable: any[] = [];
  public inputDataPage = 0;
  public inputDataPageSize = 5;
  public inputDataTotalPages = 1;
  private inputDataJsonUrl = 'assets/input-data.json'; // Path to your JSON file

  openInputDataPopup(row: any, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showInputDataModal = true;
    this.inputDataPage = 0;
    this.inputDataTable = [];
    this.pagedInputDataTable = [];
    // Optionally, you can use row to determine which JSON to load
    this.http.get<any[]>(this.inputDataJsonUrl).subscribe(
      data => {
        this.inputDataTable = data;
        this.inputDataTotalPages = Math.ceil(this.inputDataTable.length / this.inputDataPageSize);
        this.updatePagedInputDataTable();
      },
      error => {
        this.inputDataTable = [];
        this.inputDataTotalPages = 1;
        this.updatePagedInputDataTable();
      }
    );
  }

  updatePagedInputDataTable(): void {
    const start = this.inputDataPage * this.inputDataPageSize;
    const end = start + this.inputDataPageSize;
    this.pagedInputDataTable = this.inputDataTable.slice(start, end);
  }

  inputDataPrevPage(): void {
    if (this.inputDataPage > 0) {
      this.inputDataPage--;
      this.updatePagedInputDataTable();
    }
  }

  inputDataNextPage(): void {
    if (this.inputDataPage < this.inputDataTotalPages - 1) {
      this.inputDataPage++;
      this.updatePagedInputDataTable();
    }
  }

  inputDataGoToPage(page: number): void {
    if (page >= 0 && page < this.inputDataTotalPages) {
      this.inputDataPage = page;
      this.updatePagedInputDataTable();
    }
  }

  downloadInputDataExcel(): void {
    // Simple CSV export for demo; for real Excel, use a library like xlsx
    if (!this.inputDataTable || this.inputDataTable.length === 0) return;
    const header = Object.keys(this.inputDataTable[0]);
    const csvRows = [header.join(",")];
    for (const row of this.inputDataTable) {
      csvRows.push(header.map(key => JSON.stringify(row[key] ?? "")).join(","));
    }
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'input-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  closeInputDataPopup(): void {
    this.showInputDataModal = false;
    this.inputDataTable = [];
  }

  public showBackupTableModal = false;
  public backupTableModalData: any[] = [];
  public pagedBackupTableModalData: any[] = [];
  public backupTableModalPage = 0;
  public backupTableModalPageSize = 5;
  public backupTableModalTotalPages = 1;
  private backupTableModalJsonUrl = 'assets/backup-table1-data.json';

  openBackupTableModal(type: 'backupTable1' | 'backupTable2', event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showBackupTableModal = true;
    this.backupTableModalPage = 0;
    this.backupTableModalData = [];
    this.pagedBackupTableModalData = [];
    // For now, both types use the same JSON. You can switch based on type if needed.
    this.http.get<any[]>(this.backupTableModalJsonUrl).subscribe(
      data => {
        this.backupTableModalData = data;
        this.backupTableModalTotalPages = Math.ceil(this.backupTableModalData.length / this.backupTableModalPageSize);
        this.updatePagedBackupTableModalData();
      },
      error => {
        this.backupTableModalData = [];
        this.backupTableModalTotalPages = 1;
        this.updatePagedBackupTableModalData();
      }
    );
  }

  closeBackupTableModal(): void {
    this.showBackupTableModal = false;
    this.backupTableModalData = [];
    this.pagedBackupTableModalData = [];
  }

  updatePagedBackupTableModalData(): void {
    const start = this.backupTableModalPage * this.backupTableModalPageSize;
    const end = start + this.backupTableModalPageSize;
    this.pagedBackupTableModalData = this.backupTableModalData.slice(start, end);
  }

  backupTableModalPrevPage(): void {
    if (this.backupTableModalPage > 0) {
      this.backupTableModalPage--;
      this.updatePagedBackupTableModalData();
    }
  }

  backupTableModalNextPage(): void {
    if (this.backupTableModalPage < this.backupTableModalTotalPages - 1) {
      this.backupTableModalPage++;
      this.updatePagedBackupTableModalData();
    }
  }

  backupTableModalGoToPage(page: number): void {
    if (page >= 0 && page < this.backupTableModalTotalPages) {
      this.backupTableModalPage = page;
      this.updatePagedBackupTableModalData();
    }
  }

  downloadBackupTableExcel(): void {
    if (!this.backupTableModalData || this.backupTableModalData.length === 0) return;
    const header = Object.keys(this.backupTableModalData[0]);
    const csvRows = [header.join(",")];
    for (const row of this.backupTableModalData) {
      csvRows.push(header.map(key => JSON.stringify(row[key] ?? "")).join(","));
    }
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-table-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Pagination for Account Analysis Table
  public backupTablePage = 0;
  public backupTablePageSize = 5;
  public backupTableTotalPages = 1;
  public pagedBackupTableData: any[] = [];

  updatePagedBackupTableData(): void {
    this.backupTableTotalPages = Math.ceil(this.backupTableData.length / this.backupTablePageSize);
    const start = this.backupTablePage * this.backupTablePageSize;
    const end = start + this.backupTablePageSize;
    this.pagedBackupTableData = this.backupTableData.slice(start, end);
  }

  backupTablePrevPage(): void {
    if (this.backupTablePage > 0) {
      this.backupTablePage--;
      this.updatePagedBackupTableData();
    }
  }

  backupTableNextPage(): void {
    if (this.backupTablePage < this.backupTableTotalPages - 1) {
      this.backupTablePage++;
      this.updatePagedBackupTableData();
    }
  }

  backupTableGoToPage(page: number): void {
    if (page >= 0 && page < this.backupTableTotalPages) {
      this.backupTablePage = page;
      this.updatePagedBackupTableData();
    }
  }

}
