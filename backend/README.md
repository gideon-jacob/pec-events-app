## Backend (Node.js/Express)

### Overview

- Express API with TypeScript
- Security via `helmet` and `express-rate-limit`
- CORS configured for dev and prod
- Ready for Docker and reverse proxy (nginx/cloudflared)

### Requirements

- Node.js 18+
- npm 10+

### Installation (local)

```bash
cd backend
npm install
```

### Environment variables

Create `backend/.env` (see `backend/.env.example` if present):

```
# Required: JWT Secret for authentication
# Generate a secure secret using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_secure_jwt_secret_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

PORT=5000
# Uncomment and set if/when MongoDB is used
# MONGODB_URI=mongodb://mongodb:27017/eventdb

# Frontend origin for production CORS (only used in production)
# Example: https://your-frontend.example.com
FRONTEND_URL=

# How Express trusts proxy headers (X-Forwarded-For, etc.)
# Accepts: true|false|<number_of_hops>|CSV of CIDRs/named ranges
# Defaults to: loopback, linklocal, uniquelocal, 10/8, 172.16/12, 192.168/16
# Examples:
# TRUST_PROXY=1
# TRUST_PROXY=true
TRUST_PROXY=
```

### CORS policy

- Dev (`NODE_ENV !== 'production'`): all origins allowed; credentials disabled by default (useful for Expo/web and tunnels).
- Prod: only `FRONTEND_URL` is allowed. Do not include a trailing slash (e.g., `https://app.example.com`, not `https://app.example.com/`).
- If you need cookies or other credentialed requests, set `credentials: true` and use an explicit origin. Browsers do not allow wildcard origin (`*`) together with credentials.

### Rate limiting

- Default: 100 requests per 15 minutes per client IP

- When running behind proxies/load balancers, ensure `trust proxy` is set appropriately so the client IP is detected correctly (see `TRUST_PROXY` in env vars).

### Scripts

```bash
# Dev (ts-node-dev)
npm run dev

# Build TypeScript → dist/
npm run build

# Start compiled app (after build)
npm start
```

### Run with Docker Compose (recommended)

From repo root:

```bash
docker compose up -d backend
docker compose logs backend -f | cat
```

- The service is exposed on `http://localhost:5000`
- Optional: `backend_tunnel` publishes the API via Cloudflare Quick Tunnel

### API

- GET `/api/hello` → `{ message: string }`

Example:

```bash
curl -s http://localhost:5000/api/hello
```

### Reverse proxy and tunnels

- If running behind nginx or cloudflared, `X-Forwarded-*` headers are set.
- The app sets `trust proxy` safely by default for private networks. Override with `TRUST_PROXY` if needed.

### Security notes

- `helmet` is enabled by default
- CORS locked down in production
- Rate limiting enabled; ensure `trust proxy` is set correctly when behind proxies
- **JWT_SECRET is mandatory**: The application will fail to start if JWT_SECRET is not set
- Generate a secure JWT secret for each environment (dev, staging, production)
- Never commit JWT_SECRET to version control

### Troubleshooting

- **JWT_SECRET not set**: The application will exit with an error if JWT_SECRET is missing. Generate a secure secret and add it to your .env file
- CORS blocked in production: set `FRONTEND_URL` to your deployed frontend origin
- Rate-limit error about `X-Forwarded-For`: set `TRUST_PROXY` (e.g., `1` if behind one proxy)
- Port in use: change `PORT` or stop the conflicting process
