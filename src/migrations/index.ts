import * as migration_20260304_023444_initial_schema from './20260304_023444_initial_schema';
import * as migration_20260304_065827_add_img_name_to_slides from './20260304_065827_add_img_name_to_slides';

export const migrations = [
  {
    up: migration_20260304_023444_initial_schema.up,
    down: migration_20260304_023444_initial_schema.down,
    name: '20260304_023444_initial_schema',
  },
  {
    up: migration_20260304_065827_add_img_name_to_slides.up,
    down: migration_20260304_065827_add_img_name_to_slides.down,
    name: '20260304_065827_add_img_name_to_slides'
  },
];
