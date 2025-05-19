import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/drawer/services/shared.service';
import { Product } from './products.constant';

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.scss'],
})
export class ProductsManagementComponent implements OnInit {
  status: any = '';
  imgUrl!: any;
  file!: any;
  productForm!: FormGroup;
  productId!: any;
  products: Product[] = [];

  statusList: any[] = [
    {
      name: 'In Stock',
      value: 1,
    },
    {
      name: 'Out Of Stock',
      value: 0,
    },
  ];

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    console.log(this.productId);
    this.initializeProductForm();
    if (this.productId) {
      this.getProductById();
    }
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public sharedService: SharedService,
    private route: ActivatedRoute
  ) {}

  initializeProductForm(data?:any) {
    this.productForm = this.fb.group({
      name: [data? data.name:''],
      status: [data? data.status:''],
      price: [data? data.price:''],
      quantity: [data? data.quantity:''],
    });
  }

  addProduct() {
    const payload = this.productForm.value;
    this.imgUrl ? (payload.image = this.imgUrl) : (payload.image = '');
    this.sharedService.create(payload).subscribe((res) => {
      console.log('Product created!');
      this.router.navigateByUrl('/main/inventory');
    });
  }
  updateProduct() {
    const payload = this.productForm.value;
    this.imgUrl ? (payload.image = this.imgUrl) : (payload.image = '');
    this.sharedService.update(this.productId,payload).subscribe((res) => {
      console.log('Product created!');
      this.router.navigateByUrl('/main/inventory');
    });
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result;
    };
    reader.readAsDataURL(this.file);
  }

  getProductById() {
    this.sharedService.getById(this.productId).subscribe((data: any) => {
      this.products = data;
      this.imgUrl = data.image
      this.initializeProductForm(this.products)
    });
  }
}
