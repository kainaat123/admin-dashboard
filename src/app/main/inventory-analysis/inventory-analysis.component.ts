import { Component, OnInit } from '@angular/core';
import { Product } from '../products-management/products.constant';
import { SharedService } from '../shared/drawer/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CLOSING } from 'ws';

@Component({
  selector: 'app-inventory-analysis',
  templateUrl: './inventory-analysis.component.html',
  styleUrls: ['./inventory-analysis.component.scss'],
})
export class InventoryAnalysisComponent implements OnInit {
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.options = {
      data: [{ name: 'pen', price: 78 }],
      series: [
        {
          xKey: 'name',
          yKey: 'price',
        },
      ],
    };
  }

  status: any = '';
  searchBy: any;
  timer: any;
  params: any = {};
  public options: any;

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
  graphData: any[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'quantity',
    'price',
    'status',
    'action',
  ];
  ngOnInit() {
    this.getAllProducts();
  }

  products: Product[] = [];

  getAllProducts() {
    this.sharedService
      .getAllProducts(this.params)
      .subscribe((data: Product[]) => {
        this.products = data;
        const filteredProducts = this.products.forEach((prod: Product) => {
          const obj = {
            name: prod.name,
            price: +prod.price,
          };
          this.graphData.push(obj);
          this.options.data = this.graphData;
          //console.log(this.options)
        });
      });
  }

  deleteProduct(id: any) {
    this.sharedService.delete(id).subscribe((res) => {
      this.getAllProducts();
    });
  }

  onRowClick(row: Product) {
    this.router.navigate([`/main/products/${row.id}`], {
      queryParams: { id: row.id },
    });
  }
  searchData(search: any) {
    this.params.search = search.value ? search.value : '';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getAllProducts();
    }, 1000);
  }

  filterByStatus(event: any) {
    this.params.status = event;
    this.getAllProducts();
  }
}
