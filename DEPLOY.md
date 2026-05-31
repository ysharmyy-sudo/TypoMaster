## Deploy (quick)

### 1) Backend env
Edit `backend/.env` and set:
- `MONGO_URI`
- **New Email OTP login (required):**
  - `JWT_SECRET` (long random string)
  - **Recommended (works best on Render): Resend (HTTPS, no SMTP timeouts)**
    - `RESEND_API_KEY`
    - `RESEND_FROM` (example: `Pariksha Typing Tutor <onboarding@resend.dev>`)
  - **Alternative: Gmail SMTP**
    - `SMTP_USER` (your Gmail)
    - `SMTP_PASS` (Gmail *App Password* — requires 2FA)
    - recommended on Render:
      - `SMTP_HOST=smtp.gmail.com`
      - `SMTP_PORT=587`
      - `SMTP_SECURE=false`
    - optional: `SMTP_FROM`
  - optional: `OTP_TTL_MINUTES` / `OTP_RESEND_COOLDOWN_SECONDS`
- **Firebase Admin (server-side)** (optional / backward compatible, only needed if you still use Firebase ID tokens):
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (stringified JSON)
  - OR `FIREBASE_SERVICE_ACCOUNT_BASE64` (base64 of the JSON)
- optional: `FRONTEND_URL` (for Razorpay payment link callback redirect)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- optional: `RAZORPAY_WEBHOOK_SECRET` (only if you enable webhooks)

### 2) Frontend env
Create `.env` in project root (or use `.env.example`) and set:
- `VITE_API_URL` (example: `http://localhost:5000`)
> Note: Firebase client config is no longer required for the new email OTP + password login flow.

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
