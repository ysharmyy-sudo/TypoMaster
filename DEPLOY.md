## Deploy (quick)

### 1) Backend env
Edit `backend/.env` and set:
- `MONGO_URI`
- **Firebase Admin (server-side)** (use ONE):
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (stringified JSON)
  - OR `FIREBASE_SERVICE_ACCOUNT_BASE64` (base64 of the JSON)
- optional: `FRONTEND_URL` (for Razorpay payment link callback redirect)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- optional: `RAZORPAY_WEBHOOK_SECRET` (only if you enable webhooks)

### 2) Frontend env
Create `.env` in project root (or use `.env.example`) and set:
- `VITE_API_URL` (example: `http://localhost:5000`)
- Firebase client config:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_APP_ID`

### 3) Run locally
Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
npm install
npm run dev
```

### 4) Razorpay webhook
Set webhook URL:
`<YOUR_BACKEND_URL>/api/payment/webhook`

Enable events:
- `payment.captured`
- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `subscription.completed`
- `subscription.halted`
