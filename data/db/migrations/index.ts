import * as migration_20250911_202618 from './20250911_202618';
import * as migration_20250912_193510 from './20250912_193510';
import * as migration_20250913_023205 from './20250913_023205';

export const migrations = [
  {
    up: migration_20250911_202618.up,
    down: migration_20250911_202618.down,
    name: '20250911_202618',
  },
  {
    up: migration_20250912_193510.up,
    down: migration_20250912_193510.down,
    name: '20250912_193510',
  },
  {
    up: migration_20250913_023205.up,
    down: migration_20250913_023205.down,
    name: '20250913_023205'
  },
];
