import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AgChartOptions } from 'ag-charts-community';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  switchMap,
} from 'rxjs';
import {
  Product,
  STATUS_OPTIONS,
} from '../products-management/products.constant';
import { SharedService } from '../shared/drawer/services/shared.service';

@Component({
  selector: 'app-inventory-analysis',
  templateUrl: './inventory-analysis.component.html',
  styleUrls: ['./inventory-analysis.component.scss'],
})
export class InventoryAnalysisComponent implements OnInit {
  private readonly sharedService = inject(SharedService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusList = [{ name: 'All', value: '' as const }, ...STATUS_OPTIONS];
  readonly displayedColumns = ['id', 'name', 'quantity', 'price', 'status', 'action'];

  searchBy = '';
  status: number | '' = '';
  products: Product[] = [];
  loading = true;
  options: AgChartOptions = this.buildChart([]);

  private readonly search$ = new Subject<string>();
  private readonly status$ = new BehaviorSubject<number | ''>('');
  private readonly refresh$ = new Subject<void>();

  ngOnInit(): void {
    const search = this.search$.pipe(
      map((term) => term.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    );

    // One stream for search, status and refreshes. switchMap cancels
    // a request that's still running when a newer one starts.
    combineLatest([search, this.status$])
      .pipe(
        switchMap(([term, status]) =>
          merge(this.refresh$, [undefined]).pipe(
            switchMap(() => this.sharedService.getAllProducts({ search: term, status }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (products) => {
          this.products = products;
          this.options = this.buildChart(products);
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  searchData(term: string): void {
    this.search$.next(term);
  }

  filterByStatus(status: number | ''): void {
    this.status$.next(status);
  }

  deleteProduct(id: number, event: Event): void {
    event.stopPropagation();
    this.sharedService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh$.next());
  }

  editProduct(row: Product, event?: Event): void {
    event?.stopPropagation();
    this.router.navigate(['/main/products', row.id]);
  }

  trackById(_: number, product: Product): number {
    return product.id;
  }

  /** A new options object each time, so ag-charts redraws. */
  private buildChart(products: Product[]): AgChartOptions {
    return {
      title: { text: 'Price by product' },
      data: products.map((p) => ({ name: p.name, price: Number(p.price) })),
      series: [{ type: 'column', xKey: 'name', yKey: 'price', yName: 'Price (USD)', fill: '#35b4ad', strokeWidth: 0 }],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left', label: { formatter: ({ value }) => `$${Number(value).toLocaleString()}` } },
      ],
      legend: { enabled: false },
    };
  }
}
