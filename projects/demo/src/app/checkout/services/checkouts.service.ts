import { Injectable } from '@angular/core';
import { Comparer, createStoreAdapter, IdSelector } from 'ngx-entity-store';
import { StoreKey } from '../../core/models/state';
import { CheckoutItem } from '../models/checkout-item';

@Injectable({
  providedIn: 'root',
})
export class CheckoutsService {
  private readonly checkoutSorter: Comparer<CheckoutItem> = (a, b) =>
    a.productName.localeCompare(b.productName) || a.id.localeCompare(b.id);

  private readonly checkoutSelector: IdSelector<CheckoutItem> = (c) => c.id;

  private readonly storeAdapter = createStoreAdapter<CheckoutItem>(
    StoreKey.Checkouts,
    this.checkoutSelector,
    this.checkoutSorter
  );

  checkoutItems$ = this.storeAdapter.entities$;

  constructor() {}

  add(item: CheckoutItem) {
    this.storeAdapter.addOne(item);
  }

  remove(item: CheckoutItem) {
    this.storeAdapter.removeOne(item.id);
  }

  removeAll() {
    this.storeAdapter.removeAll();
  }

  increaseCheckoutItemCount(item: CheckoutItem) {
    if (item.count > 99) return;

    this.storeAdapter.updateOne({
      id: item.id,
      //Only the updated fields needs to be set;
      changes: {
        count: item.count + 1,
        total: item.total + item.price,
      },
    });
  }

  decreaseCheckoutItemCount(item: CheckoutItem) {
    if (item.count < 2) return;

    // Same behavior can be achieved using mapOne,
    // while updateOne() using the object passed to calculate total,
    // mapOne uses the object from store.
    this.storeAdapter.mapOne({
      id: item.id,
      map: (entity) => {
        return {
          ...entity,
          count: entity.count - 1,
          total: entity.total - entity.price,
        };
      },
    });
  }

  applyDiscount(percent: number) {
    this.storeAdapter.mapMany((entity) => {
      return {
        ...entity,
        discount: percent,
      };
    });
  }
}
