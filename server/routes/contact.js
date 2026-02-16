import { Router } from 'express';
import rateLimit from 'express-rate-limit';

export const contactRouter = Router();

// 5 submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
});

const isProd = process.env.NODE_ENV === 'production';

/** POST /api/contact — public contact form submission (rate-limited). */
contactRouter.post('/', contactLimiter, async (req, res) => {
  try {
    const supabase = req.supabaseAdmin;
    if (!supabase) return res.status(503).json({ error: 'Database not configured' });

    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { error } = await supabase
      .from('emails')
      .insert([{
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        ip_address: req.ip || null,
        user_agent: req.headers['user-agent'] || null,
        status: 'pending',
      }]);

    if (error) throw error;

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: isProd ? 'Submission failed' : (err.message || 'Submission failed') });
  }
});
