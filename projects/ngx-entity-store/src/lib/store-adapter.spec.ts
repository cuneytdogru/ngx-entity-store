import { TestBed } from '@angular/core/testing';
import { createStoreAdapter } from './create-adapter';
import { getInitialEntityState } from './entity-state';
import { State, StoreConfig, Update } from './models';
import { provideStore } from './provider';
import { StoreAdapter } from './store-adapter';

import { firstValueFrom } from 'rxjs';

interface TestEntity {
  id: number;
  name: string;
}

class TestStoreState implements State {
  'testEntities' = getInitialEntityState<TestEntity>();
}

class TestStoreConfig implements StoreConfig {
  state = new TestStoreState();
  testConfig = true;
}

describe('StoreAdapter', () => {
  let adapter: StoreAdapter<TestEntity>;
  const STORE_CONFIG = new TestStoreConfig();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideStore(STORE_CONFIG)],
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      adapter = createStoreAdapter<TestEntity>('testEntities');
    });

    STORE_CONFIG.state.testEntities = getInitialEntityState<TestEntity>();
  });

  it('should create an instance', () => {
    expect(adapter).toBeTruthy();
  });

  it('should return the state', async () => {
    expect(STORE_CONFIG.state.testEntities).toEqual(
      await firstValueFrom(adapter.state$)
    );

    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(entity);
    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(newState.ids).toHaveLength(1);
  });

  it('should return the entities only exists in the ids collection', async () => {
    //Only modifying the entities, not ids.
    STORE_CONFIG.state.testEntities.entities = {
      2: { id: 2, name: 'Test Entity' },
    };

    expect(Object.keys(STORE_CONFIG.state.testEntities.entities)).toHaveLength(
      1
    );
    expect(STORE_CONFIG.state.testEntities.ids).toHaveLength(0);
    expect(await firstValueFrom(adapter.entities$)).toHaveLength(0);

    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    expect(Object.keys(STORE_CONFIG.state.testEntities.entities)).toHaveLength(
      2
    );
    expect(STORE_CONFIG.state.testEntities.ids).toHaveLength(1);
    expect(await firstValueFrom(adapter.entities$)).toHaveLength(1);
  });

  it('should select one entity by id', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[entity.id]).toEqual(
      await firstValueFrom(adapter.select(entity.id))
    );
  });

  it('should add one entity', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };

    adapter.addOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(newState.ids).toHaveLength(1);
    expect(newState.entities[1]).toEqual(entity);
    expect(newState.ids[0]).toEqual(entity.id);
  });

  it('should add many entities', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];

    adapter.addMany(entities);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(2);
    expect(newState.ids).toHaveLength(2);
    expect(newState.entities[entities[0].id]).toEqual(entities[0]);
    expect(newState.entities[entities[1].id]).toEqual(entities[1]);
  });

  it('should set all entities', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];

    adapter.setAll(entities);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(2);
    expect(newState.ids).toHaveLength(2);
    expect(newState.entities[entities[0].id]).toEqual(entities[0]);
    expect(newState.entities[entities[1].id]).toEqual(entities[1]);
  });

  it('should set many entities', async () => {
    const existingEntities = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];

    adapter.addMany(existingEntities);

    const entities: TestEntity[] = [
      { id: 1, name: 'Set Entity 1' },
      { id: 3, name: 'Set Entity 2' },
      { id: 4, name: 'Set Entity 4' },
    ];

    adapter.setMany(entities);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(4);
    expect(newState.ids).toHaveLength(4);

    //Last added should be first
    expect(newState.entities[4]).toEqual(entities[2]);
    expect(newState.ids[0]).toEqual(entities[2].id);

    expect(newState.entities[3]).toEqual(entities[1]);
    expect(newState.ids[1]).toEqual(entities[1].id);

    expect(newState.entities[1]).toEqual(entities[0]);
    expect(newState.ids[2]).toEqual(entities[0].id);

    //Not set should be last
    expect(newState.entities[2]).toEqual(existingEntities[1]);
    expect(newState.ids[3]).toEqual(existingEntities[1].id);
  });

  it('should set one entity when exists', async () => {
    const existingEntities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];

    adapter.addMany(existingEntities);

    const entity: TestEntity = { id: 1, name: 'Test Entity' };

    adapter.setOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(entity);
    expect(newState.entities[2]).toEqual(existingEntities[1]);
    expect(Object.keys(newState.entities)).toHaveLength(2);
    expect(Object.keys(newState.ids)).toHaveLength(2);
  });

  it('should set one entity when not exists', async () => {
    const existingEntities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];

    adapter.addMany(existingEntities);

    const entity: TestEntity = { id: 3, name: 'Test Entity' };
    adapter.setOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(existingEntities[0]);
    expect(newState.entities[2]).toEqual(existingEntities[1]);
    expect(newState.entities[3]).toEqual(entity);
    expect(Object.keys(newState.entities)).toHaveLength(3);
    expect(Object.keys(newState.ids)).toHaveLength(3);
  });

  it('should remove one entity', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];
    adapter.addMany(entities);

    adapter.removeOne(entities[0].id);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(Object.keys(newState.ids)).toHaveLength(1);
    expect(newState.entities[2]).toEqual(entities[1]);
  });

  it('should remove many entities by id', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];
    adapter.addMany(entities);

    adapter.removeMany([entities[0].id, entities[1].id]);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(Object.keys(newState.ids)).toHaveLength(1);
    expect(newState.entities[3]).toEqual(entities[2]);
  });

  it('should remove many entities by predicate', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];
    adapter.addMany(entities);

    adapter.removeMany((x) => x.id > 2);

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(2);
    expect(Object.keys(newState.ids)).toHaveLength(2);
    expect(newState.entities[1]).toEqual(entities[0]);
    expect(newState.entities[2]).toEqual(entities[1]);
  });

  it('should remove all entities', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];
    adapter.addMany(entities);

    adapter.removeAll();

    const newState = await firstValueFrom(adapter.state$);

    expect(Object.keys(newState.entities)).toHaveLength(0);
    expect(Object.keys(newState.ids)).toHaveLength(0);
    expect(newState).toEqual(getInitialEntityState<TestEntity>());
  });

  it('should update one entity', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    const update: Update<TestEntity> = {
      id: entity.id,
      changes: { name: 'Updated Entity' },
    };

    adapter.updateOne(update);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual({
      ...entity,
      name: 'Updated Entity',
    });
    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(Object.keys(newState.ids)).toHaveLength(1);
  });

  it('should not update one entity if doesnt exists', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    const update: Update<TestEntity> = {
      id: 2,
      changes: { name: 'Not found entity' },
    };

    adapter.updateOne(update);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(entity);
    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(Object.keys(newState.ids)).toHaveLength(1);
  });

  it('should update many entities', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];

    adapter.addMany(entities);

    const updates: Update<TestEntity>[] = [
      { id: 1, changes: { name: 'Updated Entity 1' } },
      { id: 2, changes: { name: 'Updated Entity 2' } },
    ];

    adapter.updateMany(updates);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual({
      ...entities[0],
      name: 'Updated Entity 1',
    });

    expect(newState.entities[2]).toEqual({
      ...entities[1],
      name: 'Updated Entity 2',
    });

    expect(newState.entities[3]).toEqual(entities[2]);

    expect(Object.keys(newState.entities)).toHaveLength(3);
    expect(Object.keys(newState.ids)).toHaveLength(3);
  });

  it('should insert one entity with upsert', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };

    adapter.upsertOne(entity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(entity);
    expect(Object.keys(newState.entities)).toHaveLength(1);
    expect(Object.keys(newState.ids)).toHaveLength(1);
  });

  it('should update one entity with upsert', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];

    adapter.addMany(entities);

    const updatedEntity: TestEntity = {
      ...entities[0],
      name: 'Updated Entity',
    };

    adapter.upsertOne(updatedEntity);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(updatedEntity);
    expect(newState.entities[2]).toEqual(entities[1]);
    expect(newState.entities[3]).toEqual(entities[2]);
    expect(Object.keys(newState.entities)).toHaveLength(3);
    expect(Object.keys(newState.ids)).toHaveLength(3);
  });

  it('should insert many entities with upsertMany', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];

    adapter.upsertMany(entities);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(entities[0]);
    expect(newState.entities[2]).toEqual(entities[1]);
    expect(Object.keys(newState.entities)).toHaveLength(2);
    expect(Object.keys(newState.ids)).toHaveLength(2);
  });

  it('should update many entities with upsertMany', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
      { id: 3, name: 'Entity 3' },
    ];
    adapter.addMany(entities);

    const updatedEntities: TestEntity[] = [
      { id: 1, name: 'Updated Entity 1' },
      { id: 2, name: 'Updated Entity 2' },
    ];

    adapter.upsertMany(updatedEntities);

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toEqual(updatedEntities[0]);
    expect(newState.entities[2]).toEqual(updatedEntities[1]);
    expect(newState.entities[3]).toEqual(entities[2]);
    expect(Object.keys(newState.entities)).toHaveLength(3);
    expect(Object.keys(newState.ids)).toHaveLength(3);
  });

  it('should map one entity', async () => {
    const entity: TestEntity = { id: 1, name: 'Test Entity' };
    adapter.addOne(entity);

    adapter.mapOne({
      id: entity.id,
      map: (entity) => {
        return {
          ...entity,
          name: 'Mapped Entity',
        };
      },
    });

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toBeDefined();
    expect(newState.entities[1]!.name).toEqual('Mapped Entity');
  });

  it('should map many entities', async () => {
    const entities: TestEntity[] = [
      { id: 1, name: 'Entity 1' },
      { id: 2, name: 'Entity 2' },
    ];
    adapter.addMany(entities);

    adapter.mapMany((entity) => {
      return {
        ...entity,
        name: 'Mapped Entity',
      };
    });

    const newState = await firstValueFrom(adapter.state$);

    expect(newState.entities[1]).toBeDefined();
    expect(newState.entities[2]).toBeDefined();

    expect(newState.entities[1]!.name).toEqual('Mapped Entity');
    expect(newState.entities[2]!.name).toEqual('Mapped Entity');
  });
});
