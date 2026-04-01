import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_rels" ADD COLUMN "media_id" integer;
   ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX "courses_rels_media_id_idx" ON "courses_rels" USING btree ("media_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_media_fk";
   ALTER TABLE "courses_rels" DROP COLUMN "media_id";`)
}
