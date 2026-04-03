# Qualitech — HTTP API (JSON)

Base URL: same origin as the app (e.g. `APP_URL`). Errors use `{ error: { code, message, details? } }` unless noted.

## Public

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | `{ ok, db: "up" \| "down" }` |
| GET | `/api/machines` | Query: `locale`, `page`, `limit`, optional `categorySlug`, `featured` |
| GET | `/api/machines/[slug]` | Query: `locale` |
| GET | `/api/blog` | Listing + pagination |
| GET | `/api/blog/[slug]` | Query: `locale` |
| POST | `/api/contact` | JSON body + optional `Idempotency-Key` header; optional reCAPTCHA when env set |

## Admin (auth required)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/admin/auth/login` | Sets session cookie |
| POST | `/api/admin/auth/logout` | |
| GET | `/api/admin/auth/me` | |
| GET/POST | `/api/admin/machines` | CRUD shapes in Zod admin schemas |
| GET/PATCH/DELETE | `/api/admin/machines/[id]` | |
| GET/POST | `/api/admin/blog` | |
| GET/PATCH/DELETE | `/api/admin/blog/[id]` | |
| POST | `/api/admin/upload/presign` | Body: `scope` (`machines` \| `blog`), `contentType`, `byteLength` → presigned PUT + `publicUrl` |

## Observability

- Responses under `/api/*` include **`x-request-id`** (client may send the same header to correlate).
- Production logs are **single-line JSON** (`level`, `message`, `time`, optional `requestId`, …).

## R2 upload flow (admin)

1. `POST /api/admin/upload/presign` with `Cookie` session.
2. `PUT` the file bytes to `data.uploadUrl` with `Content-Type` and `Content-Length` exactly as issued.
3. Save `data.publicUrl` via admin PATCH/create (`images[].url`, `ogImageUrl`, etc.).
