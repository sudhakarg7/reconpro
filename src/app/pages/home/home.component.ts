// Angular modules
import { NgIf, NgFor }                 from '@angular/common';
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

Chart.register(CategoryScale, LinearScale, BarController, BarElement);


@Component({
  selector    : 'app-home',
  templateUrl : './home.component.html',
  styleUrls   : ['./home.component.scss'],
  standalone  : true,
  imports     : [PageLayoutComponent, NgIf, NgFor, ProgressBarComponent, BaseChartDirective ]
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
      x: {},
      y: {
        min: -6000000, // Adjust to accommodate negative values
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      // },
    },
  };
  public barChartType = 'bar' as const;

  // Updated to reflect your payroll data
  public barChartData: ChartData<'bar'> = {
    labels: ['Payroll Wk1', 'Payroll Wk2', 'Payroll Wk3', 'Payroll Wk4', 'Total General Ledger'],
    datasets: [
      { data: [0, 0, 0, 0, -19571.45], label: 'Opening Balance' },
      { data: [-563.81, -2720707.75, -1311.01, -2618335.23, -5340917.80], label: 'Payroll Activity' },
      { data: [30470.29, 2580225.61, 25022.90, 2503856.08, 5139574.88], label: 'Funding' },
      { data: [0, 0, 34644.64, 35464.39, 70109.03], label: 'Mismapping Reclass' },
      { data: [0, 0, 0, 0, 68087.18], label: 'GL Adj/JE\'s' },
      { data: [-29909.89, 103907.34, -23711.48, 50087.93, 0], label: 'Interco With OTHR Divisions' }
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
      outStatus: { value: '150/200', file: 'out-may.xlsx' }
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
      outStatus: { value: '150/200', file: 'out-april.xlsx' }
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
      outStatus: { value: '150/200', file: 'out-march.xlsx' }
    }
  ];

  // Download Excel for a specific row/column
  public downloadStatusExcel(fileName: string): void {
    // In a real app, you would generate or fetch the file dynamically
    // For demo, just trigger download from assets (ensure files exist or handle 404)
    const fileUrl = `assets/${fileName}`;
    this.downloadExcelFile(fileUrl);
  }

}
