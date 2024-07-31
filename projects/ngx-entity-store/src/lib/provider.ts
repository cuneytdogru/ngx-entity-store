import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { STORE_TOKEN } from './constants';
import { StoreConfig } from './models';
import { Store } from './store';

export function provideStore(
  config: Partial<StoreConfig>
): EnvironmentProviders {
  const defaultConfig = {
    state: {},
  } as StoreConfig;

  const merged = { ...defaultConfig, ...config } as StoreConfig;

  return makeEnvironmentProviders([
    {
      provide: STORE_TOKEN,
      useValue: merged.state,
    },
    {
      provide: Store,
      deps: [STORE_TOKEN],
    },
  ]);
}
