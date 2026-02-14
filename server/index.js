import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WorkOS } from '@workos-inc/node';
import { createClient } from '@supabase/supabase-js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Support one origin or comma-separated list (e.g. local + Vercel)
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, origin || allowedOrigins[0]);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  req.workos = workos;
  req.supabaseAdmin = supabaseAdmin;
  req.adminEmails = adminEmails;
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
