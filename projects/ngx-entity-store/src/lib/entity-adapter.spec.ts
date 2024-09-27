import { createEntityAdapter } from './create-adapter';
import { EntityAdapter } from './entity-adapter';
import { getInitialEntityState } from './entity-state';
import { EntityState, IdSelector } from './models';

interface TestEntity {
  id: number;
  name: string;
}

describe('EntityAdapter', () => {
  let adapter: EntityAdapter<TestEntity>;
  let entityState: EntityState<TestEntity>;

  beforeEach(() => {
    adapter = createEntityAdapter<TestEntity>();
    entityState = getInitialEntityState<TestEntity>();
  });

  it('should create an instance', () => {
    expect(adapter).toBeTruthy();
  });

  it('should select by selectId fn', () => {
    const selectNameFn: IdSelector<TestEntity> = (a: TestEntity) => a.name;

    adapter = createEntityAdapter<TestEntity>(selectNameFn, undefined);

    const entities: TestEntity[] = [
      { id: 1, name: 'Entity Z' },
      { id: 1, name: 'Entity B' },
      { id: 1, name: 'Entity H' },
    ];

    adapter.addMany(entities, entityState);

    const newEntities: TestEntity[] = [
      { id: 1, name: 'Entity Y' },
      { id: 1, name: 'Entity A' },
    ];

    adapter.addMany(newEntities, entityState);

    expect(Object.keys(entityState.entities)).toHaveLength(5);
    expect(Object.keys(entityState.ids)).toHaveLength(5);

    expect(entityState.entities[entities[0].name]).toEqual(entities[0]);
    expect(entityState.entities[entities[1].name]).toEqual(entities[1]);
    expect(entityState.entities[entities[2].name]).toEqual(entities[2]);
    expect(entityState.entities[newEntities[0].name]).toEqual(newEntities[0]);
    expect(entityState.entities[newEntities[1].name]).toEqual(newEntities[1]);
  });

  it('should re-sort after merging new entities', () => {
    const sortFn = (a: TestEntity, b: TestEntity) =>
      a.name.localeCompare(b.name);

    adapter = createEntityAdapter<TestEntity>(undefined, sortFn);

    const entities: TestEntity[] = [
      { id: 1, name: 'Entity Z' },
      { id: 3, name: 'Entity B' },
      { id: 5, name: 'Entity H' },
    ];

    adapter.addMany(entities, entityState);

    const newEntities: TestEntity[] = [
      { id: 2, name: 'Entity Y' },
      { id: 4, name: 'Entity A' },
    ];

    adapter.addMany(newEntities, entityState);

    expect(entityState.entities[1]).toEqual(entities[0]);
    expect(entityState.entities[2]).toEqual(newEntities[0]);
    expect(entityState.entities[3]).toEqual(entities[1]);
    expect(entityState.entities[4]).toEqual(newEntities[1]);
    expect(entityState.entities[5]).toEqual(entities[2]);

    expect(Object.keys(entityState.entities)).toHaveLength(5);
    expect(Object.keys(entityState.ids)).toHaveLength(5);

    const orderedList = [...entities, ...newEntities].sort(sortFn);

    Object.keys(entityState.ids).forEach((key: any, index: number) => {
      expect(orderedList[index].id).toEqual(entityState.ids[key]);
      expect(orderedList[index]).toEqual(
        entityState.entities[entityState.ids[index]]
      );
    });
  });
});
