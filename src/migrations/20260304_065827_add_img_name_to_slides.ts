import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_slides" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "courses_slides" ADD COLUMN "img_name" varchar;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_slides" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "courses_slides" DROP COLUMN "img_name";`)
}
