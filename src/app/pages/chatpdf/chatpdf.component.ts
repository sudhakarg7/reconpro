import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { ApiService } from '@services/api.service';
import { EventSourceService } from '@services/event-source.service';
import { map, Observable, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-chatpdf',
  standalone: true,
  imports     : [PageLayoutComponent,FormsModule, NgIf, ProgressBarComponent,ReactiveFormsModule, NgFor, CommonModule ],
  templateUrl: './chatpdf.component.html',
  styleUrl: './chatpdf.component.scss'
})
export class ChatpdfComponent {
  extractedText!: string;
  ollamaResponse: string = '';
  ollamaResponse$!: Observable<string>;
  
  isLoading: boolean = false;


  
  constructor(
    private eventSourceService: EventSourceService,
    private apiService: ApiService, private cdr: ChangeDetectorRef

) {
    const url = 'https://your-server.com/sse';
    const options = { withCredentials: true };
    const eventNames = ['myEventName'];

    this.eventSourceSubscription = this.eventSourceService.connectToServerSentEvents(url, options, eventNames)
        .subscribe({
                next: data => {
                    //handle event
                },
                error: error => {
                    //handle error
                }
            }
        );
}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.apiService.extractTextFromPdf(file).subscribe(response => {
        this.extractedText = response.extracted_text;
      });
    }
  }

  // askQuestion(): void {
  //   const query = 'Skills';
  //   this.apiService.askOllama(query, this.extractedText).subscribe((response:any) => {
  //     this.ollamaResponse = response;
  //   });
  // }

  // Call the stream API and update response as chunks arrive
  askQuestion(): void {
    const query = 'Education Details';  // Example query
    this.isLoading = true;
    this.ollamaResponse = '';  // Reset before starting new stream


    // this.apiService.askOllamaStream(query, this.extractedText).subscribe({
    //   next: (chunk) => {
    //     try {
    //       const parsedChunk = JSON.parse(chunk);
    //       this.ollamaResponse += parsedChunk.response;
    //     } catch (error) {
    //       console.error('Error parsing chunk:', error);
    //     }
    //   },
    //   error: (err) => {
    //     console.error('SSE connection error:', err);  // Log detailed error
    //     this.isLoading = false;
    //   },
    //   complete: () => {
    //     this.isLoading = false;
    //     console.log('Streaming complete');
    //   }
    // });
  }



  @ViewChild('responseContainer') responseContainer!: ElementRef;

  ollamaResponse1: string = '';

  // Other code...

  private scrollToBottom(): void {
    this.responseContainer.nativeElement.scrollTop = this.responseContainer.nativeElement.scrollHeight;
  }

  



  askQuestion1(query: string, contextText: string) {
    this.isLoading = true;
    this.ollamaResponse$ = 
    this.apiService.askOllamaStreamData(query, this.extractedText)

    // this.apiService.askOllamaStreamData(query, this.extractedText).subscribe(d=>{
    //   console.log(d, " ANAND TESTING")
    // })


    //   this.apiService.askOllamaStream1(query, contextText).subscribe({
  //     next: (chunk) => {
  //       this.ollamaResponse += chunk;
  //       this.scrollToBottom();  // Scroll down when new data arrives
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  }
  sseData: string[] = [];  // Array to hold the streamed chunks
  // ngOnInit() {
  //   this.startSseStream();
  // }

  // Function to start listening to the SSE stream
  startSseStream() {
    this.isLoading = true;
    this.apiService.getSseStream().subscribe({
      next: (data) => {
        this.sseData.push(data);  // Append new chunk of data to the array
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('SSE connection error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;  // Streaming complete
        this.cdr.detectChanges();
      }
    });
  }


  // Function to start listening to the SSE stream
  startSseStreamFinal(query: string, contextText: string) {
    this.isLoading = true;

    // Subscribe to the SSE Observable
    this.apiService.getSseStreamFinal(query, contextText).subscribe({
      next: (data) => {
        this.sseData.push(data);  // Append the new data chunk to the array
      },
      error: (err) => {
        console.error('SSE connection error:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;  // Streaming complete
      }
    });
  }






  // sse service

  private readonly eventSourceSubscription!: SubscriptionLike;


    ngOnDestroy() {
        this.eventSourceSubscription.unsubscribe();
        this.eventSourceService.close();
    }


    data$!: Observable<any>;
    queryInputs:string = ''
    ngOnInit() {
      // this.pingOllama()
    }
    pingOllama() {
      this.data$ = this.apiService.getDataStream(this.queryInputs, this.extractedText).pipe(
        map(response => {
          // Process the streaming response here
          return response;
        })
      );
    }
}
