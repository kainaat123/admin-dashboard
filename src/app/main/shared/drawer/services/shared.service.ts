import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from 'src/app/main/products-management/products.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  apiUrl = environment.apiServer;

  create(product: any): Observable<Product> {
    return this.httpClient
      .post<Product>(
        this.apiUrl + '/products/',
        JSON.stringify(product),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getById(id: string): Observable<Product> {
    return this.httpClient
      .get<Product>(this.apiUrl + '/products/' + id)
      .pipe(catchError(this.errorHandler));
  }

  getAllProducts(params?: any): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.apiUrl + '/products/', { params: params })
      .pipe(catchError(this.errorHandler));
  }

  update(id: string, product: any): Observable<Product> {
    return this.httpClient
      .put<Product>(
        this.apiUrl + '/products/' + id,
        JSON.stringify(product),
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  delete(id: string) {
    return this.httpClient
      .delete<Product>(this.apiUrl + '/products/' + id, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: {
    error: { message: string };
    status: any;
    message: any;
  }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
