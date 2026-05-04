import { migration001 } from './001_initial';
import { migration002 } from './002_add_profile_preferences';

export interface Migration {
  version: number;
  name: string;
  sql: string;
}

export const migrations: Migration[] = [migration001, migration002];
