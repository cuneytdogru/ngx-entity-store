import { Predicate } from '@angular/core';
import {
  Comparer,
  EntityMapOne,
  EntityState,
  IdSelector,
  Update,
} from './models';
import { selectIdValue } from './utils';

export class EntityAdapter<T> {
  constructor(private selectId: IdSelector<T>, private sort?: Comparer<T>) {}

  addOne(entity: T, state: EntityState<T>) {
    this.addMany([entity], state);
  }

  addMany(newEntities: T[], state: EntityState<T>) {
    const models = newEntities.filter(
      (model) => !(selectIdValue(model, this.selectId) in state.entities)
    );

    if (models.length) this.merge(models, state);
  }

  setAll(entities: T[], state: EntityState<T>) {
    state.ids = [];
    state.entities = {};

    this.addMany(entities, state);
  }

  setOne(entity: T, state: EntityState<T>) {
    const key = selectIdValue(entity, this.selectId);

    if (key in state.entities) {
      state.ids = state.ids.filter((val: string | number) => val !== key);
      this.merge([entity], state);
    } else {
      this.addOne(entity, state);
    }
  }

  setMany(entities: T[], state: EntityState<T>) {
    entities.map((entity) => this.setOne(entity, state));
  }

  removeOne(key: string | number, state: EntityState<T>) {
    return this.removeMany([key], state);
  }

  removeMany(keysOrPredicate: any[] | Predicate<T>, state: EntityState<T>) {
    const keys =
      keysOrPredicate instanceof Array
        ? keysOrPredicate
        : state.ids.filter((key: any) => keysOrPredicate(state.entities[key]!));

    const didMutate =
      keys
        .filter((key: any) => key in state.entities)
        .map((key: any) => delete state.entities[key]).length > 0;

    if (didMutate) {
      state.ids = state.ids.filter((id: any) => id in state.entities);
    }
  }

  removeAll(state: EntityState<T>) {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  private takeUpdatedModel(
    models: T[],
    update: Update<T>,
    state: EntityState<T>
  ): boolean {
    if (!(update.id in state.entities)) {
      return false;
    }

    const original = state.entities[update.id];
    const updated = Object.assign({}, original, update.changes);
    const newKey = selectIdValue(updated, this.selectId);

    delete state.entities[update.id];

    models.push(updated);

    return newKey !== update.id;
  }

  updateOne(update: Update<T>, state: EntityState<T>) {
    return this.updateMany([update], state);
  }

  updateMany(updates: Update<T>[], state: EntityState<T>) {
    const models: T[] = [];

    updates.filter((update) => this.takeUpdatedModel(models, update, state))
      .length > 0;

    if (models.length === 0) {
      return;
    } else {
      state.ids = state.ids.filter((id: any, index: number) => {
        if (id in state.entities) {
          return true;
        }

        return false;
      });

      this.merge(models, state);
    }
  }

  upsertOne(entity: T, state: EntityState<T>) {
    this.upsertMany([entity], state);
  }

  upsertMany(entities: T[], state: EntityState<T>) {
    const added: any[] = [];
    const updated: any[] = [];

    for (const entity of entities) {
      const id = selectIdValue(entity, this.selectId);
      if (id in state.entities) {
        updated.push({ id, changes: entity });
      } else {
        added.push(entity);
      }
    }

    this.updateMany(updated, state);
    this.addMany(added, state);
  }

  mapOne(map: EntityMapOne<T>, state: EntityState<T>) {
    const entity = state.entities[map.id];
    if (!entity) return;

    const updatedEntity = map.map(entity);
    return this.updateOne(
      {
        id: map.id as any,
        changes: updatedEntity,
      },
      state
    );
  }

  private merge(models: T[], state: EntityState<T>): void {
    models.sort(this.sort);

    const ids: any[] = [];

    let i = 0;
    let j = 0;

    while (i < models.length && j < state.ids.length) {
      const model = models[i];
      const modelId = selectIdValue(model, this.selectId);
      const entityId = state.ids[j];
      const entity = state.entities[entityId];

      if (this.sort!(model, entity!) <= 0) {
        ids.push(modelId);
        i++;
      } else {
        ids.push(entityId);
        j++;
      }
    }

    if (i < models.length) {
      state.ids = ids.concat(models.slice(i).map((x) => this.selectId(x)));
    } else {
      state.ids = ids.concat(state.ids.slice(j));
    }

    models.forEach((model, i) => {
      state.entities[this.selectId(model)] = model;
    });
  }

  // public uniqueAndSort<T extends BaseDto>(data: T[]): T[] {
  //   return this.sort(this.unique(data));
  // }

  // public unique<T extends BaseDto>(data: T[]): T[] {
  //   return data.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
  // }

  // public sort<T extends BaseDto>(data: T[]): T[] {
  //   return data.sort(
  //     (a, b) => +new Date(b.createdDate) - +new Date(a.createdDate)
  //   );
  // }
}
