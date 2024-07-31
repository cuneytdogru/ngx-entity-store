import { InjectionToken } from '@angular/core';
import { State } from './models';

export const STORE_TOKEN = new InjectionToken<State>('store');
