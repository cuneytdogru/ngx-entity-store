export type Comparer<T> = (a: T, b: T) => number;

export type IdSelectorStr<T> = (model: T) => string;
export type IdSelectorNum<T> = (model: T) => number;

export type IdSelector<T> = IdSelectorStr<T> | IdSelectorNum<T>;

export interface DictionaryNum<T> {
  [id: number]: T | undefined;
}

export abstract class Dictionary<T> implements DictionaryNum<T> {
  [id: string]: T | undefined;
}

export interface UpdateStr<T> {
  id: string;
  changes: Partial<T>;
}

export interface UpdateNum<T> {
  id: number;
  changes: Partial<T>;
}

export type Update<T> = UpdateStr<T> | UpdateNum<T>;

export type Predicate<T> = (entity: T) => boolean;

export type EntityMap<T> = (entity: T) => T;

export interface EntityMapOneNum<T> {
  id: number;
  map: EntityMap<T>;
}

export interface EntityMapOneStr<T> {
  id: string;
  map: EntityMap<T>;
}

export type EntityMapOne<T> = EntityMapOneNum<T> | EntityMapOneStr<T>;

export interface EntityState<T> {
  ids: (string | number)[];
  entities: Dictionary<T>;
}

export class State {
  [key: string]: any;
}

export class StoreConfig {
  state: State = {};
}
