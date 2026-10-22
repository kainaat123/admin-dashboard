import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from 'src/app/main/products-management/products.constant';
import { environment } from 'src/environments/environment';

export interface ProductFilters {
  search?: string;
  status?: number | '';
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly apiUrl = `${environment.apiServer}/products`;

  constructor(private httpClient: HttpClient) {}

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.httpClient
      .post<Product>(this.apiUrl, product)
      .pipe(catchError(this.errorHandler));
  }

  getById(id: string | number): Observable<Product> {
    return this.httpClient
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  /** json-server filters: `name_like` for search, `status` for exact status. */
  getAllProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filters.search?.trim()) {
      params = params.set('name_like', filters.search.trim());
    }
    if (filters.status !== undefined && filters.status !== '') {
      params = params.set('status', String(filters.status));
    }
    return this.httpClient
      .get<Product[]>(this.apiUrl, { params })
      .pipe(catchError(this.errorHandler));
  }

  update(id: string | number, product: Omit<Product, 'id'>): Observable<Product> {
    return this.httpClient
      .put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.errorHandler));
  }

  delete(id: string | number): Observable<unknown> {
    return this.httpClient
      .delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    const message =
      error.error instanceof ErrorEvent
        ? error.error.message
        : `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(message);
    return throwError(() => new Error(message));
  }
}
