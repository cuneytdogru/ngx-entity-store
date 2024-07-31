import { Inject } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { STORE_TOKEN } from './constants';
import { getInitialEntityState } from './entity-state';
import { EntityState, State } from './models';

export class Store {
  constructor(@Inject(STORE_TOKEN) private userState: State) {}

  private _store = new BehaviorSubject<State>(this.userState);
  store$ = this._store.asObservable().pipe(distinctUntilChanged());

  get value(): State {
    return this._store.value;
  }

  select<T>(name: string): Observable<EntityState<T>> {
    return this.store$.pipe(
      map((x) => x[name as keyof State] as EntityState<T>)
    );
  }

  set<T>(name: string, state: EntityState<T>) {
    this._store.next({
      ...this._store.value,
      [name]: state,
    });
  }

  reset<T>(name: string) {
    this._store.next({
      ...this._store.value,
      [name]: getInitialEntityState<T>(),
    });
  }
}
