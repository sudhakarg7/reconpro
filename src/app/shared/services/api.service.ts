import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000'; // Flask API URL

  constructor(private http: HttpClient) {}

  // Function to upload PDF and extract text
  extractTextFromPdf(pdfFile: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('pdf', pdfFile, pdfFile.name);

    return this.http.post<any>(`${this.apiUrl}/extract-text`, formData);
  }

  // Function to ask Ollama a question
  askOllama(query: string, contextText: string): Observable<any> {
    const body = { query, context_text: contextText };
    return this.http.post<any>(`${this.apiUrl}/ask-ollama`, body);
  }

  // // Stream response from Ollama using GET request with query parameters
  // askOllamaStream(query: string, contextText: string): Observable<string> {
  //   return new Observable<string>(observer => {
  //     const eventSource = new EventSource(`${this.apiUrl}/ask-ollama-stream?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(contextText)}`);

  //     eventSource.onmessage = (event) => {
  //       observer.next(event.data);
  //     };

  //     eventSource.onerror = (error) => {
  //       observer.error(error);
  //       eventSource.close();  // Close the stream if an error occurs
  //     };

  //     return () => eventSource.close();  // Cleanup when the subscription ends
  //   });
  // }

  askOllamaStream(query: string, contextText: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(
        `${this.apiUrl}/ask-ollama-stream?query=${encodeURIComponent(
          query
        )}&context_text=${encodeURIComponent(contextText)}`
      );

      eventSource.onmessage = (event) => {
        observer.next(event.data); // Send each chunk of data to subscribers
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        observer.error(error); // Pass error to subscribers
        eventSource.close(); // Close the connection if an error occurs
      };

      return () => {
        eventSource.close(); // Close connection when unsubscribing
      };
    });
  }

  askOllamaStreamData(query: string, contextText: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/event-stream',
    });
    // return this.http.get<any>(

    //   `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(contextText)}`,
    //   {headers}
    // );

    return this.http
      .get(
        `${this.apiUrl}/stream-data?query=${encodeURIComponent(
          query
        )}&context_text=${encodeURIComponent(contextText)}`,
        { observe: 'events', responseType: 'text' }
      ) // Observe events and response as text for streaming
      .pipe(
        tap((data: any) =>
          console.log('Data arrived! -> ' + JSON.stringify(data))
        ) // Log the received data
      );
  }

  askOllamaStream1(query: string, contextText: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(
        `${this.apiUrl}/ask-ollama-stream1?query=${encodeURIComponent(
          query
        )}&context_text=${encodeURIComponent(contextText)}`
      );

      eventSource.onmessage = (event) => {
        observer.next(event.data); // Send each chunk of data to subscribers
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        observer.error(error); // Pass error to subscribers
        eventSource.close(); // Close the connection if an error occurs
      };

      return () => {
        eventSource.close(); // Close connection when unsubscribing
      };
    });
  }

  private sseUrl = 'http://127.0.0.1:5000/stream-data'; // Flask SSE endpoint

  // Function to initiate SSE connection and return Observable
  getSseStream(): Observable<string> {
    return new Observable<string>((observer) => {
      const eventSource = new EventSource(this.sseUrl); // Open SSE connection

      // Listen to incoming messages from the server
      eventSource.onmessage = (event) => {
        observer.next(event.data); // Emit received data as an Observable
      };

      // Handle any SSE errors
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        observer.error(error); // Emit error to Observable
        eventSource.close(); // Close the connection
      };

      // Cleanup function to close the SSE connection when unsubscribed
      return () => {
        eventSource.close();
      };
    });
  }

  // final solution

  private sseUrl_final = `${this.apiUrl}/stream-data`; // Your SSE endpoint

  // Function to return Observable that listens to SSE
  getSseStreamFinal(query: string, contextText: string): Observable<string> {
    return new Observable<string>((observer) => {
      const url = `${this.sseUrl_final}?query=${encodeURIComponent(
        query
      )}&context_text=${encodeURIComponent(contextText)}`;
      const eventSource = new EventSource(url); // Open SSE connection

      // Listen to the incoming messages
      eventSource.onmessage = (event) => {
        observer.next(event.data); // Emit each chunk of data to the Observable
      };

      // Handle error and close the connection
      eventSource.onerror = (error) => {
        observer.error(error); // Emit error
        eventSource.close(); // Close the connection on error
      };

      // Cleanup function to close connection when no longer needed
      return () => {
        eventSource.close();
      };
    });
  }

  getDataStream(query: string, contextText: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/stream-data?query=${encodeURIComponent(query)}&context_text=${encodeURIComponent(contextText)}`,
      { responseType: 'text' }
    );
  }
}
