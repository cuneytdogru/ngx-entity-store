import { EntityAdapter } from './entity-adapter';
import { Comparer, IdSelector } from './models';
import { StoreAdapter } from './store-adapter';

export function createEntityAdapter<T>(
  selectId?: IdSelector<T>,
  sort?: Comparer<T>
): EntityAdapter<T> {
  selectId = selectId ?? ((entity: any) => entity.id);

  return new EntityAdapter<T>(selectId, sort);
}

export function createStoreAdapter<T>(
  storeKey: string,
  selectId?: IdSelector<T>,
  sort?: Comparer<T>
): StoreAdapter<T> {
  selectId = selectId ?? ((entity: any) => entity.id);

  return new StoreAdapter<T>(storeKey, selectId, sort);
}
