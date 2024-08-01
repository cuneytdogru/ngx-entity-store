import { getInitialEntityState, State } from 'ngx-entity-store';
import { CheckoutItem } from '../../checkout/models/checkout-item';
import { Product } from '../../products/models/product';

export enum StoreKey {
  Checkouts = 'checkouts',
  Products = 'products',
}

class DemoStoreState implements State {
  'checkouts' = getInitialEntityState<CheckoutItem>();
  'products' = getInitialEntityState<Product>();
}

export const STORE_KEYS = StoreKey;
export const STORE_STATE = new DemoStoreState();
