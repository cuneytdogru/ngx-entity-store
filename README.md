# Angular Applicaiton Store + Entity Adapter

This library provides simple store and entity adapter for the applicaitons that do not want to use NgRx but still wants to use its store and entity features inside the project. 

Most of the codes managing records via entity adapter directly copied from NgRX/entity package.

## Installation
1. Download the library: `npm i ngx-entity-store --save`
2. Import and provide the `provideStore` in your `app.module.ts`:
    ```typescript
    import { provideStore } from 'ngx-entity-store';

    @NgModule({
      providers: [
        provideStore({ state: STORE_STATE }),
      ],
    })
    export class AppModule {}
    ```
## Usage
    
1. Define the state to use for store:
   ```typescript
   class DemoStoreState implements State {
      'checkouts' = getInitialEntityState<CheckoutItem>();
      'products' = getInitialEntityState<Product>();
   }

   export const STORE_STATE = new DemoStoreState();
   ```
2. Then you can create an entity adapter in your services or anywhere you want like below:
   ```typescript
   private readonly productSorter: Comparer<Product> = (a, b) =>
        b.name > a.name ? -1 : 1;
   
   private readonly productSelector: IdSelector<Product> = (p) => p.id;

   private readonly storeAdapter = createStoreAdapter<Product>(
        'products',
        this.productSelector,
        this.productSorter
   );
   ```
3. Thats it! Now you have a store and adapter to modify it:
    ```typescript
      add(item: CheckoutItem) {
        this.storeAdapter.addOne(item);
      }
    
      remove(item: CheckoutItem) {
        this.storeAdapter.removeOne(item.id);
      }
    
      increaseCheckoutItemCount(item: CheckoutItem) {
        this.storeAdapter.updateOne({
          id: item.id,
          changes: {
            ...item,
            count: item.count + 1,
            total: item.total + item.price,
          },
        });
      }
    ```

## Entity Adapter Methods
You can use the below methods to modify states of the entites:
```typescript
    select(id: string): Observable<T | undefined>;
    addOne(entity: T): void;
    addMany(entities: T[]): void;
    setAll(entities: T[]): void;
    setOne(entity: T): void;
    setMany(entities: T[]): void;
    removeOne(key: string | number): void;
    removeMany(keysOrPredicate: any[] | Predicate<T>): void;
    removeAll(): void;
    updateOne(update: Update<T>): void;
    updateMany(updates: Update<T>[]): void;
    upsertOne(entity: T): void;
    upsertMany(entities: T[]): void;
    mapOne(map: EntityMapOne<T>): void;
    mapMany(map: EntityMap<T>): void;
 ```
