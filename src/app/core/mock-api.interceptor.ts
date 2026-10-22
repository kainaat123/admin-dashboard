import { Injectable } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map, of, shareReplay, switchMap, throwError } from 'rxjs';
import { Product } from '../main/products-management/products.constant';
import { environment } from 'src/environments/environment';

const STORAGE_KEY = 'admin-dashboard.products';
const SEED_URL = 'assets/seed-products.json';

/**
 * Serves /products from the browser (localStorage) so the hosted demo works
 * without json-server. Only active when environment.useMockApi is true.
 * Supports the same filters the app uses: name_like and status.
 */
@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private seed$?: Observable<Product[]>;
  private memory?: Product[];

  // A client built on HttpBackend skips interceptors, which avoids a circular dependency.
  private readonly http: HttpClient;

  constructor(backend: HttpBackend) {
    this.http = new HttpClient(backend);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const base = `${environment.apiServer}/products`;
    if (!environment.useMockApi || !req.url.startsWith(base)) {
      return next.handle(req);
    }
    const id = req.url.slice(base.length).replace(/^\//, '');

    return this.load().pipe(
      switchMap((products) => {
        switch (req.method) {
          case 'GET':
            if (id) {
              const found = products.find((p) => String(p.id) === id);
              return found ? this.ok(found) : this.notFound();
            }
            return this.ok(this.filter(products, req));
          case 'POST': {
            const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
            const created = { ...(req.body as Omit<Product, 'id'>), id: nextId };
            this.save([...products, created]);
            return this.ok(created, 201);
          }
          case 'PUT': {
            const updated = { ...(req.body as Product), id: Number(id) };
            this.save(products.map((p) => (String(p.id) === id ? updated : p)));
            return this.ok(updated);
          }
          case 'DELETE':
            this.save(products.filter((p) => String(p.id) !== id));
            return this.ok({});
          default:
            return next.handle(req);
        }
      })
    );
  }

  private filter(products: Product[], req: HttpRequest<unknown>): Product[] {
    const search = req.params.get('name_like')?.toLowerCase();
    const status = req.params.get('status');
    return products.filter(
      (p) =>
        (!search || p.name.toLowerCase().includes(search)) &&
        (status === null || String(p.status) === status)
    );
  }

  /** Products from this session, then localStorage, then the bundled seed data. */
  private load(): Observable<Product[]> {
    if (this.memory) return of(structuredClone(this.memory));
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.memory = JSON.parse(stored) as Product[];
        return of(structuredClone(this.memory));
      }
    } catch {
      /* storage blocked: fall back to seed data */
    }
    this.seed$ ??= this.http.get<Product[]>(SEED_URL).pipe(shareReplay(1));
    return this.seed$.pipe(map((seed) => structuredClone(seed)));
  }

  private save(products: Product[]): void {
    this.memory = products;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      /* storage full or blocked: changes last for this session */
    }
  }

  private ok(body: unknown, status = 200) {
    return of(new HttpResponse({ status, body }));
  }

  private notFound() {
    return throwError(() => ({ status: 404, message: 'Product not found' }));
  }
}
