import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/drawer/services/shared.service';
import { Product, STATUS_OPTIONS, StockStatus } from './products.constant';

/** Longest side of a stored product image, in pixels. */
const MAX_IMAGE_SIZE = 400;

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.scss'],
})
export class ProductsManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sharedService = inject(SharedService);
  private readonly destroyRef = inject(DestroyRef);

  readonly statusList = STATUS_OPTIONS;
  productId: string | null = null;
  imgUrl = '';
  saving = false;

  readonly productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    status: [StockStatus.InStock as StockStatus, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.sharedService
        .getById(this.productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((product: Product) => {
          this.imgUrl = product.image ?? '';
          this.productForm.patchValue({
            name: product.name,
            status: Number(product.status),
            price: Number(product.price),
            quantity: Number(product.quantity),
          });
        });
    }
  }

  save(): void {
    if (this.productForm.invalid || this.saving) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const value = this.productForm.getRawValue();
    const payload = {
      ...value,
      price: Number(value.price),
      quantity: Number(value.quantity),
      status: Number(value.status),
      image: this.imgUrl,
    };
    const request$ = this.productId
      ? this.sharedService.update(this.productId, payload)
      : this.sharedService.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigateByUrl('/main/inventory'),
      error: () => (this.saving = false),
    });
  }

  /** Shrinks the picked image before storing it, so the product list stays light. */
  async uploadFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.imgUrl = await resizeImage(file, MAX_IMAGE_SIZE);
  }
}

async function resizeImage(file: File, maxSize: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = '#fff'; // JPEG has no transparency
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.8);
}
