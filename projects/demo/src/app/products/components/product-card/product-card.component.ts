import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutItem } from '../../../checkout/models/checkout-item';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<CheckoutItem>();

  constructor(private fb: FormBuilder) {}

  form = this.fb.nonNullable.group({
    count: this.fb.nonNullable.control(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
  });

  add() {
    this.addToCart.emit({
      id: uuidv4(),
      count: this.form.value.count!,
      productId: this.product.id,
      productName: this.product.name,
      price: this.product.price,
      discount: 0,
      total: this.product.price * this.form.value.count!,
    });

    this.form.reset();
  }
}
