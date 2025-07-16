import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '@services/api.service';
import { EventSourcePolyfill } from 'event-source-polyfill'; // Correct import for the polyfill
import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-chatai',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, NgxExtendedPdfViewerModule, FormsModule],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chatai.component.html',
  styleUrls: ['./chatai.component.scss']
})
export class ChataiComponent {
  private apiUrl = 'http://127.0.0.1:5000';
  streamData: string = ''; // Store streamed content as string initially
  safeStreamData: SafeHtml = ''; // SafeHtml to sanitize dynamic HTML content
  loading: boolean = true;

  pdfSrc: string | ArrayBuffer | null = null; // Dynamic PDF Source

  messages: { content: string, isUser: boolean }[] = [];
  newMessage: string = '';
  extractedText: any;
  docID: string = ''

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private apService:ApiService
  ) {}

  ngOnInit(): void {
    // this.pingApi()
  }




   // Handle PDF file selection and upload
   onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    // if (file) {
    //   const formData = new FormData();
    //   formData.append('file', file);

    //   // API call to upload the file
    //   this.http.post(`${this.apiUrl}/upload`, formData).subscribe(
    //     (response: any) => {
    //       // Assuming the response has the PDF URL
    //       this.pdfSrc = response.pdfUrl; // Set the source for the PDF viewer
    //     },
    //     error => {
    //       console.error('File upload error:', error);
    //     }
    //   );
    // }

    if (file) {
      this.pdfSrc = URL.createObjectURL(file); 
      // Use the extractTextFromPdf method from your apService
      this.apService.extractTextFromPdf(file).subscribe(
        response => {
          this.extractedText = response.extracted_text; // Store the extracted text
          this.docID = response.docID; // Store the extracted text
          // You could now display this extractedText in your component or process it further
          // this.pdfSrc = URL.createObjectURL(file); // Display the selected PDF in viewer
        },
        error => {
          console.error('File upload or text extraction error:', error);
        }
      );
    }
  }

  // Chat message handling
  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ content: this.newMessage, isUser: true });

      const userMessage = this.newMessage;
      // this.newMessage = '';
      // this.messages.push({ content: response.message, isUser: false });
      this.pingApi(this.newMessage)
      this.newMessage = '';
    }
  }

//  // Stream API data using EventSourcePolyfill
// pingApi(query: string) {
//   const url = `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(this.extractedText)}`;

//   const eventSource = new EventSourcePolyfill(url);

//   let streamDataChunk = '';

//   eventSource.onmessage = (event) => {
//     const parsedData = JSON.parse(event.data);
//     const processedText = this.processStreamedText(parsedData.response);

//     // Accumulate the streamed chunk as a string
//     streamDataChunk += processedText;

//     this.zone.run(() => {
//       this.loading = false;

//       // Concatenate each streamed chunk to the main streamData
//       this.streamData += processedText;

//       // Store the raw HTML (string) and sanitized HTML separately
//       const sanitizedStreamData = this.sanitizer.bypassSecurityTrustHtml(this.streamData);

//       // If you're displaying it in the UI (sanitize the content)
//       this.safeStreamData = sanitizedStreamData;

//       // If you're storing it in the messages array (use the string version)
//       if (this.messages.length > 0 && !this.messages[this.messages.length - 1].isUser) {
//         this.messages[this.messages.length - 1].content = this.streamData; // Use string here
//       } else {
//         this.messages.push({ content: this.streamData, isUser: false });
//       }
//     });
//   };

//   eventSource.onerror = (error) => {
//     console.error('SSE Error:', error);
//     this.zone.run(() => {
//       this.loading = false;
//     });
//     eventSource.close();
//   };
// }



//   // Helper function to process streamed text (replace \n with <br>)
//   processStreamedText(text: string): string {
//     return text.replace(/\n/g, '<br>');
//   }
respTxt:string = ''
pingApi(query: string) {
  // Clear previous stream data
  this.streamData = '';
  this.safeStreamData = this.sanitizer.bypassSecurityTrustHtml(this.streamData);
  this.loading = true;

  // const url = `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(this.extractedText)}`;
  const url = `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&docID=${encodeURIComponent(this.docID)}&context_text=${encodeURIComponent(this.extractedText)}`;
  // Initialize EventSourcePolyfill for older browser support
  const eventSource = new EventSourcePolyfill(url);

  // Set a timeout (e.g., 45 seconds)
  const timeoutDuration = 60000; // 45 seconds in milliseconds
  const timeoutId = setTimeout(() => {
    console.warn('Request timed out after 45 seconds.');
    this.zone.run(() => {
      this.loading = false; // Stop loading due to timeout
    });
    eventSource.close(); // Close the EventSource on timeout
  }, timeoutDuration);
let fullResponse = ''
  eventSource.onmessage = (event) => {
    // Clear the timeout if data starts streaming within the allowed time
    clearTimeout(timeoutId);
    const data = JSON.parse(event.data);
        if (data.done) {
            // Finalize the response
            console.log("Full Response End:");
            // Handle the complete response as needed
        } else {
            // Accumulate the response chunks
            fullResponse += data.response;
            console.log("---------Response:", fullResponse);
        }

    const parsedData = JSON.parse(event.data);
    const processedText = this.processStreamedText(parsedData.response);
    console.log(processedText);
    this.respTxt += processedText;

    // Safely update the UI inside Angular's NgZone
    this.zone.run(() => {
      this.loading = false;
      this.streamData += processedText; // Concatenate the streamed text
      this.safeStreamData = this.sanitizer.bypassSecurityTrustHtml(this.streamData); // Sanitize final data
    });
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    clearTimeout(timeoutId); // Clear the timeout if an error occurs
    this.zone.run(() => {
      this.loading = false; // Stop loading in case of error
    });
    eventSource.close(); // Stop the event source on error
  };
}



  // pingApi(query:string){
  //   const url = `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(this.extractedText)}`;
  //   // Initialize EventSourcePolyfill for older browser support
  //   const eventSource = new EventSourcePolyfill(url);

  //   eventSource.onmessage = (event) => {
  //     const parsedData = JSON.parse(event.data);
  //     const processedText = this.processStreamedText(parsedData.response);
  //     console.log(processedText)
  //     this.respTxt +=processedText 

  //     // Safely update the UI inside Angular's NgZone
  //     this.zone.run(() => {
  //       this.loading = false;
  //       this.streamData += processedText; // Concatenate the streamed text
  //       this.safeStreamData = this.sanitizer.bypassSecurityTrustHtml(this.streamData); // Sanitize final data
  //     });
  //   };

  //   eventSource.onerror = (error) => {
  //     console.error('SSE Error:', error);
  //     this.zone.run(() => {
  //       this.loading = false; // Stop loading in case of error
  //     });
  //     eventSource.close(); // Stop the event source on error
  //   };
  // }

  // Helper function to format streamed text (convert \n to <br>)
  processStreamedText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }





  // // pdf preview area
  // // pdfSrc = 'assets/sundarr_resume_2022.pdf'; 
  // pdfSrc = '/assets/sundarr_resume_2022.pdf'; 


  // messages: string[] = [];
  // newMessage = '';

  // sendMessage() {
  //   if (this.newMessage.trim()) {
  //     this.messages.push(this.newMessage);
  //     this.newMessage = '';
  //   }
  // }
}

















// import { CommonModule, NgFor, NgIf } from '@angular/common';
// import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import oboe from 'oboe';

// @Component({
//   selector: 'app-chatai',
//   standalone: true,
//   imports: [NgIf, NgFor, CommonModule],
//   templateUrl: './chatai.component.html',
//   styleUrls: ['./chatai.component.scss']
// })
// export class ChataiComponent {
//   private apiUrl = 'http://127.0.0.1:5000';
//   private url: string = `${this.apiUrl}/stream-data?query=${encodeURIComponent('list the Programming languages')}&context_text=${encodeURIComponent('Mastery of programming languages such as Python, Java, or JavaScript is essential for developing software, automating tasks, and integrating systems.')}`;
//   streamData: SafeHtml = '';
//   loading: boolean = true;

//   constructor(private cdr: ChangeDetectorRef, private zone: NgZone, private sanitizer: DomSanitizer) {}

//   // ngOnInit() {
//   //   const options: oboe.Options = {
//   //     url: this.url,
//   //     method: 'GET'
//   //   };

//   //   const oboeService = oboe(options);
//   //   oboeService.node('!.*', (stream) => {
//   //     console.log(stream);
//   //     this.streamData.push(JSON.parse(stream));
//   //     this.loading = false; // Set loading to false once data starts streaming
//   //     this.cdr.detectChanges(); // Manually trigger change detection
//   //   });

//   //   oboeService.fail((error) => {
//   //     console.error('Error:', error);
//   //     this.loading = false; // Set loading to false in case of error
//   //     this.cdr.detectChanges(); // Manually trigger change detection
//   //   });
//   // }


//   ngOnInit(): void {
//     const url = `${this.apiUrl}/stream-data?query=${encodeURIComponent('list the programming language')}&context_text=${encodeURIComponent('Programming languages such as Java and JavaScript')}`;

//     const eventSource = new EventSource(url);

//     eventSource.onmessage = (event) => {
//       const parsedData = JSON.parse(event.data);
//       const processedText = this.processStreamedText(parsedData.response);

//       // Update the data inside Angular's NgZone to ensure UI is updated
//       this.zone.run(() => {
//         this.loading = false;
//         // Concatenate the streamed text
//         this.streamData = this.sanitizer.bypassSecurityTrustHtml(this.streamData + processedText);
//       });
//     };

//     eventSource.onerror = (error) => {
//       console.error('SSE Error:', error);
//       eventSource.close();
//     };
//   }

//   // Function to process streamed text and convert \n to <br>
//   processStreamedText(text: string): string {
//     return text.replace(/\n/g, '<br>');
//   }
  
// }
