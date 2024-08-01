import { Injectable } from '@angular/core';
import { Comparer, createStoreAdapter, IdSelector } from 'ngx-entity-store';
import { firstValueFrom } from 'rxjs';
import { StoreKey } from '../../core/models/state';
import { products as seedProducts } from '../constants/seed';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly productSorter: Comparer<Product> = (a, b) =>
    b.name > a.name ? -1 : 1;

  private readonly productSelector: IdSelector<Product> = (p) => p.id;

  private readonly storeAdapter = createStoreAdapter<Product>(
    StoreKey.Products,
    this.productSelector,
    this.productSorter
  );

  products$ = this.storeAdapter.entities$;

  constructor() {}

  add(product: Product) {
    this.storeAdapter.addOne(product);
  }

  addMany(products: Product[]) {
    this.storeAdapter.addMany(products);
  }

  async increasePrice(productId: string, count: number) {
    var product = await firstValueFrom(this.storeAdapter.select(productId));

    if (!product) return;

    var newPrice = product.price + 100 * count;

    this.storeAdapter.updateOne({
      id: product.id,
      changes: { price: newPrice },
    });
  }

  async decreasePrice(productId: string, count: number) {
    var product = await firstValueFrom(this.storeAdapter.select(productId));

    if (!product) return;

    var newPrice = product.price - 100 * count;

    this.storeAdapter.updateOne({
      id: product.id,
      changes: { price: newPrice },
    });
  }

  async resetProducts() {
    this.storeAdapter.setAll(seedProducts);
  }
}
