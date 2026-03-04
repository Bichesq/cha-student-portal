import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_slides_slide_type" AS ENUM('tutorial', 'intro', 'topics', 'content', 'content-subheadings', 'content-list', 'outro');
  CREATE TYPE "public"."enum_courses_knowledge_check_questions_question_type" AS ENUM('mcq', 'completion');
  CREATE TYPE "public"."enum_courses_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_courses_content_model" AS ENUM('slides');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_topics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar NOT NULL
  );
  
  CREATE TABLE "courses_slides_topics_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar
  );
  
  CREATE TABLE "courses_slides_subheadings_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "courses_slides_subheadings" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "courses_slides_bullet_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar
  );
  
  CREATE TABLE "courses_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"order" numeric NOT NULL,
  	"slide_type" "enum_courses_slides_slide_type" NOT NULL,
  	"image_id" integer NOT NULL,
  	"audio_id" integer,
  	"slide_title" varchar NOT NULL,
  	"content" jsonb,
  	"objective" varchar,
  	"author_name" varchar,
  	"author_role" varchar
  );
  
  CREATE TABLE "courses_knowledge_check_questions_answers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ans_id" varchar,
  	"ans" varchar,
  	"is_correct" boolean DEFAULT false
  );
  
  CREATE TABLE "courses_knowledge_check_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"order" numeric NOT NULL,
  	"question_type" "enum_courses_knowledge_check_questions_question_type" NOT NULL,
  	"question" varchar,
  	"completion_message" varchar,
  	"completion_subtext" jsonb
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"course_id" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"difficulty" "enum_courses_difficulty" NOT NULL,
  	"status" "enum_courses_status" DEFAULT 'draft' NOT NULL,
  	"objective" jsonb NOT NULL,
  	"description" jsonb NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar DEFAULT 'Author and Designer' NOT NULL,
  	"content_model" "enum_courses_content_model" DEFAULT 'slides' NOT NULL,
  	"audio_enabled" boolean DEFAULT true NOT NULL,
  	"thumbnail_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"estimated_duration" numeric,
  	"version" varchar DEFAULT '1.0',
  	"knowledge_check_allow_per_question_submit" boolean DEFAULT true NOT NULL,
  	"knowledge_check_play_on_next_default" boolean DEFAULT false NOT NULL,
  	"knowledge_check_show_progress" boolean DEFAULT true NOT NULL,
  	"knowledge_check_passing_score" numeric DEFAULT 100 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tags_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'CHA Courses' NOT NULL,
  	"site_tagline" varchar,
  	"logo_image_id" integer,
  	"primary_color" varchar DEFAULT '#0066CC',
  	"footer_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_topics" ADD CONSTRAINT "courses_topics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_slides_topics_list" ADD CONSTRAINT "courses_slides_topics_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_slides_subheadings_items" ADD CONSTRAINT "courses_slides_subheadings_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_slides_subheadings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_slides_subheadings" ADD CONSTRAINT "courses_slides_subheadings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_slides_bullet_points" ADD CONSTRAINT "courses_slides_bullet_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_slides" ADD CONSTRAINT "courses_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_slides" ADD CONSTRAINT "courses_slides_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_slides" ADD CONSTRAINT "courses_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_knowledge_check_questions_answers" ADD CONSTRAINT "courses_knowledge_check_questions_answers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_knowledge_check_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_knowledge_check_questions" ADD CONSTRAINT "courses_knowledge_check_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "tags_name_idx" ON "tags" USING btree ("name");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "courses_topics_order_idx" ON "courses_topics" USING btree ("_order");
  CREATE INDEX "courses_topics_parent_id_idx" ON "courses_topics" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_topics_list_order_idx" ON "courses_slides_topics_list" USING btree ("_order");
  CREATE INDEX "courses_slides_topics_list_parent_id_idx" ON "courses_slides_topics_list" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_subheadings_items_order_idx" ON "courses_slides_subheadings_items" USING btree ("_order");
  CREATE INDEX "courses_slides_subheadings_items_parent_id_idx" ON "courses_slides_subheadings_items" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_subheadings_order_idx" ON "courses_slides_subheadings" USING btree ("_order");
  CREATE INDEX "courses_slides_subheadings_parent_id_idx" ON "courses_slides_subheadings" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_bullet_points_order_idx" ON "courses_slides_bullet_points" USING btree ("_order");
  CREATE INDEX "courses_slides_bullet_points_parent_id_idx" ON "courses_slides_bullet_points" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_order_idx" ON "courses_slides" USING btree ("_order");
  CREATE INDEX "courses_slides_parent_id_idx" ON "courses_slides" USING btree ("_parent_id");
  CREATE INDEX "courses_slides_image_idx" ON "courses_slides" USING btree ("image_id");
  CREATE INDEX "courses_slides_audio_idx" ON "courses_slides" USING btree ("audio_id");
  CREATE INDEX "courses_knowledge_check_questions_answers_order_idx" ON "courses_knowledge_check_questions_answers" USING btree ("_order");
  CREATE INDEX "courses_knowledge_check_questions_answers_parent_id_idx" ON "courses_knowledge_check_questions_answers" USING btree ("_parent_id");
  CREATE INDEX "courses_knowledge_check_questions_order_idx" ON "courses_knowledge_check_questions" USING btree ("_order");
  CREATE INDEX "courses_knowledge_check_questions_parent_id_idx" ON "courses_knowledge_check_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_course_id_idx" ON "courses" USING btree ("course_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_thumbnail_idx" ON "courses" USING btree ("thumbnail_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_tags_id_idx" ON "courses_rels" USING btree ("tags_id");
  CREATE INDEX "courses_rels_courses_id_idx" ON "courses_rels" USING btree ("courses_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_image_idx" ON "site_settings" USING btree ("logo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "courses_topics" CASCADE;
  DROP TABLE "courses_slides_topics_list" CASCADE;
  DROP TABLE "courses_slides_subheadings_items" CASCADE;
  DROP TABLE "courses_slides_subheadings" CASCADE;
  DROP TABLE "courses_slides_bullet_points" CASCADE;
  DROP TABLE "courses_slides" CASCADE;
  DROP TABLE "courses_knowledge_check_questions_answers" CASCADE;
  DROP TABLE "courses_knowledge_check_questions" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_courses_slides_slide_type";
  DROP TYPE "public"."enum_courses_knowledge_check_questions_question_type";
  DROP TYPE "public"."enum_courses_difficulty";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum_courses_content_model";`)
}
