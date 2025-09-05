import bcrypt from 'bcrypt';
import db from '../db.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

export const signup = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    country,
    city,
    postcode,
    full_address
  } = req.body;

  if (!first_name || !last_name || !email || !password || !country || !city || !postcode || !full_address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const normalizedEmail = String(email).trim();

    const { rows: existing } = await client.query(
      'SELECT 1 FROM users WHERE email=$1',
      [normalizedEmail]
    );
    if (existing.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Clients are auto-approved by DB default ('approved')
    const userResult = await client.query(
      `INSERT INTO users
        (first_name, last_name, email, password, role, login_type, requesting_role, profile_image_url, approval_status)
       VALUES ($1,$2,$3,$4,'client','email','client',$5,'approved')
       RETURNING id, email, role, approval_status, profile_image_url`,
      [first_name, last_name, normalizedEmail, hashed, req.body.profile_image_url || null]
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO user_addresses (user_id, country, city, postcode, full_address)
       VALUES ($1,$2,$3,$4,$5)`,
      [user.id, country, city, postcode, full_address]
    );

    await client.query('COMMIT');

    // Optional: log them in right away after signup
    const token = generateToken({ id: user.id, role: user.role });
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .status(201)
      .json({ message: 'User created', user });
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('[SIGNUP ERROR]', err);
    res.status(400).json({ error: 'Signup failed' });
  } finally {
    client.release();
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
    const user = rows[0];
    if (!user || user.status !== 1) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Only gate non-clients (clients auto-approved)
    if (user.role !== 'client' && user.approval_status !== 'approved') {
      return res.status(403).json({
        message: 'Your account is awaiting approval.',
        approval_status: user.approval_status,
        approval_message: user.approval_message || null
      });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image_url: user.profile_image_url
        }
      });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: err.message });
  }
};

export const me = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Invalid token' });

  const { rows } = await db.query(
    `SELECT id, email, role, first_name, last_name, profile_image_url, approval_status FROM users WHERE id=$1`,
    [payload.id]
  );
  const user = rows[0];
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ user });
};

export const logout = async (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
};
