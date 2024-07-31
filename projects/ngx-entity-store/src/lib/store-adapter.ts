import { inject } from '@angular/core';
import { filter, map } from 'rxjs';
import { createEntityAdapter } from './create-adapter';
import {
  Comparer,
  EntityMapOne,
  IdSelector,
  Predicate,
  Update,
} from './models';
import { Store } from './store';

export class StoreAdapter<T> {
  constructor(
    private storeKey: string,
    private selectId: IdSelector<T>,
    private sort?: Comparer<T>
  ) {}

  private store: Store = inject(Store);
  private entityAdapter = createEntityAdapter(this.selectId, this.sort);

  state$ = this.store.select<T>(this.storeKey);

  entities$ = this.state$.pipe(
    map((x) => x.ids.map((id: any) => x.entities[id])),
    filter((items): items is T[] => !!items)
  );

  addOne(entity: T) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.addOne(entity, state);

    this.store.set(this.storeKey, state);
  }

  addMany(entities: T[]) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.addMany(entities, state);

    this.store.set(this.storeKey, state);
  }

  setAll(entities: T[]) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.setAll(entities, state);

    this.store.set(this.storeKey, state);
  }

  setOne(entity: T) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.setOne(entity, state);

    this.store.set(this.storeKey, state);
  }

  setMany(entities: T[]) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.setMany(entities, state);

    this.store.set(this.storeKey, state);
  }

  removeOne(key: string | number) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.removeOne(key, state);

    this.store.set(this.storeKey, state);
  }

  removeMany(keysOrPredicate: any[] | Predicate<T>) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.removeMany(keysOrPredicate, state);

    this.store.set(this.storeKey, state);
  }

  removeAll() {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.removeAll(state);

    this.store.set(this.storeKey, state);
  }

  updateOne(update: Update<T>) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.updateOne(update, state);

    this.store.set(this.storeKey, state);
  }

  updateMany(updates: Update<T>[]) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.updateMany(updates, state);

    this.store.set(this.storeKey, state);
  }

  upsertOne(entity: T) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.upsertOne(entity, state);

    this.store.set(this.storeKey, state);
  }

  upsertMany(entities: T[]) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.upsertMany(entities, state);

    this.store.set(this.storeKey, state);
  }

  mapOne(map: EntityMapOne<T>) {
    let state = this.store.value[this.storeKey];

    this.entityAdapter.mapOne(map, state);

    this.store.set(this.storeKey, state);
  }
}
