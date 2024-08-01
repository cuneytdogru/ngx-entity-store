import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CheckoutItem } from '../checkout/models/checkout-item';
import { CheckoutsService } from '../checkout/services/checkouts.service';
import { ProductCardComponent } from '../products/components/product-card/product-card.component';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  displayedColumns: string[] = ['name', 'count', 'price', 'total', 'actions'];

  discountApplied = false;
  discountPercent = 20;

  constructor(
    private checkoutsService: CheckoutsService,
    private productsService: ProductsService
  ) {}

  checkoutItems$ = this.checkoutsService.checkoutItems$;
  products$ = this.productsService.products$;

  addCheckoutItem(checkoutItem: CheckoutItem) {
    this.checkoutsService.add(checkoutItem);

    this.productsService.increasePrice(
      checkoutItem.productId,
      checkoutItem.count
    );

    if (this.discountApplied) this.applyDiscount(this.discountPercent);
  }

  deleteCheckoutItem(checkoutItem: CheckoutItem) {
    this.checkoutsService.remove(checkoutItem);

    this.productsService.decreasePrice(
      checkoutItem.productId,
      checkoutItem.count
    );
  }

  clearCheckoutItems() {
    this.checkoutsService.removeAll();
    this.productsService.resetProducts();
    this.discountApplied = false;
  }

  applyDiscount(percent: number) {
    this.discountApplied = true;
    this.checkoutsService.applyDiscount(percent);
  }

  increaseCheckoutItemCount(item: CheckoutItem) {
    this.checkoutsService.increaseCheckoutItemCount(item);
  }

  decreaseCheckoutItemCount(item: CheckoutItem) {
    this.checkoutsService.decreaseCheckoutItemCount(item);
  }
}
