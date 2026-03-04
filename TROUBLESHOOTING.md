# Troubleshooting Guide: Integrated CHA Student Portal

This document records the challenges encountered during the integration and deployment of the Student Portal with Payload CMS 3.0, along with their solutions.

## 1. Git & GitHub

### Issue: `403 Forbidden` during Push
**Symptoms:** `remote: Permission to ... denied to ... fatal: unable to access ... The requested URL returned error: 403`
**Solution:** 
- Use a **Personal Access Token (PAT)** instead of password authentication.
- Update the remote URL to include the token or reset the remote:
  ```bash
  git remote set-url origin https://<token>@github.com/Bichesq/cha-student-portal.git
  ```

---

## 2. Package Management (pnpm)

### Issue: `ERR_PNPM_OUTDATED_LOCKFILE`
**Symptoms:** `Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date`
**Cause:** Removing `@payloadcms/db-sqlite` manually from `package.json` without updating the lockfile.
**Solution:** Run pnpm with the flag to ignore the frozen state once:
```bash
pnpm install --no-frozen-lockfile
# Or if just syncing:
pnpm install --lockfile-only
```

---

## 3. Build & Compilation (Next.js/Vercel)

### Issue: Missing Module `CoursePlayerClient`
**Symptoms:** `Module not found: Can't resolve './CoursePlayerClient'`
**Cause:** The component was located in `src/app/courses/` but imported from `src/app/(frontend)/courses/[slug]/page.tsx` using a relative path `./`.
**Solution:** Move `CoursePlayerClient.tsx` into the same directory as the calling page or update the import path.

### Issue: ESLint `@eslint/eslintrc` Not Found
**Symptoms:** `ESLint: Cannot find package '@eslint/eslintrc'`
**Cause:** Next.js 15/Payload 3 templates sometimes expect this package for flat config compatibility.
**Solution:** Manually add it to dev dependencies:
```bash
pnpm add -D @eslint/eslintrc
```

### Issue: TypeScript Type Mismatch in Seed Script
**Symptoms:** `Type '"courses"' is not assignable to type ...`
**Cause:** Payload types were not regenerated after adding the `courses` collection.
**Solution:** Regenerate types:
```bash
pnpm generate:types
```

---

## 4. Payload CMS 3.0 Configuration

### Issue: Invalid `label` Property in Fields
**Symptoms:** `Object literal may only specify known properties, and 'label' does not exist in type 'admin'`
**Cause:** In Payload 3.0, the `label` property was moved from the `admin` object to the top level of the field definition.
**Solution:** Move `label` out of `admin`:
```typescript
// OLD
{
  name: 'field',
  type: 'text',
  admin: { label: 'My Label' }
}
// NEW
{
  name: 'field',
  type: 'text',
  label: 'My Label'
}
```

---

## 5. Vercel & Database Connectivity

### Issue: `ECONNREFUSED 127.0.0.1:5432` during Build
**Symptoms:** Build fails during static page generation (`generateStaticParams`).
**Cause:** 
1. The app was using `fetch` to its own API, which requires a running server (not available during build).
2. Missing environment variables (`POSTGRES_URL`) during the Vercel build phase.
**Solution:**
1. **Switch to Local API**: Use `getPayload({ config })` inside `src/lib/payload.ts` instead of `fetch`.
2. **Resiliency**: Wrap data fetching in `try/catch` blocks to allow the build to finish with empty data if the DB is unreachable.
3. **Vercel Link**: Ensure Vercel Postgres is explicitly **Linked** to the project in the Vercel Storage settings.

### Issue: `SELF_SIGNED_CERT_IN_CHAIN` during Build/Runtime
**Symptoms:** `Error: cannot connect to Postgres. Details: self-signed certificate in certificate chain`
**Cause:** Supabase/Vercel Postgres uses self-signed certificates that the Node.js `pg` client doesn't trust by default. The client often ignores the `ssl` config object if an `sslmode` parameter is already in the connection string.
**Solution:**
1. **Update Payload Config**: The `payload.config.ts` has been updated with an **aggressive fix**:
   - It **strips existing `sslmode`** parameters from the environment variable URLs using regex.
   - It **forces `sslmode=no-verify`** at the connection string level.
   - It still maintains the `ssl: { rejectUnauthorized: false }` configuration object as a secondary layer.
2. **Environment Variables**: Prioritize `POSTGRES_URL_NON_POOLING` for direct connections during build.
3. **Manual Override**: If logs still show certificate issues, check if your connection string has `sslmode` baked in elsewhere, though the regex should now handle this.

---

## 6. Database Schema & Migrations

### Issue: `relation "..." does not exist`
**Symptoms:** Error during fetch or build: `[cause]: error: relation "site_settings" does not exist`
**Cause:** The database connection is successful, but the tables have not been created. In Payload 3.0, you must generate and run migrations to synchronize your schema with the database.
**Solution:**
1. **Generate Migration**: Run the following command locally (ensure your `.env` points to the target database):
   ```bash
   pnpm run migrate:create initial_schema
   ```
2. **Commit and Push**: This will create a `src/migrations` folder. Commit this folder and push it to GitHub.
3. **Automatic Migration**: The `build` script in `package.json` has been updated to include `payload migrate`. This will run every time you deploy to Vercel.
4. **Manual Run**: If needed, you can run it manually in your local terminal (pointing to the remote DB):
   ```bash
   pnpm run migrate
   ```
