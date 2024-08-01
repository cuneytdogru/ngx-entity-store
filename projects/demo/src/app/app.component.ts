import { Component } from '@angular/core';
import { products as seedProducts } from './products/constants/seed';
import { ProductsService } from './products/services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(productsService: ProductsService) {
    productsService.addMany(seedProducts);
  }
}
