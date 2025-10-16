import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---------- small helpers ----------
const toStr = (v) => (v == null ? null : String(v).trim() || null);
const toMoney = (v) => (v == null || v === "" ? null : Number.parseFloat(v));
function minutesFromLabel(label) {
  const m = /^(\d+)\s*min$/i.exec((label || "").trim());
  return m ? parseInt(m[1], 10) : null;
}

async function getOrCreateProSalon(client, user_id, payload) {
  const { name, email, phone, description, profile_image_url } = payload || {};
  const { rows } = await client.query(
    `SELECT id FROM salons WHERE user_id=$1 AND type='beauty_professional' AND status=1 LIMIT 1`,
    [user_id]
  );
  if (rows.length) {
    const id = rows[0].id;
    await client.query(
      `UPDATE salons SET
        name = COALESCE($2,name),
        email = COALESCE($3,email),
        phone = COALESCE($4,phone),
        description = COALESCE($5,description),
        profile_image_url = COALESCE($6,profile_image_url),
        updated_at = NOW()
       WHERE id=$1`,
      [id, toStr(name), toStr(email), toStr(phone), toStr(description), toStr(profile_image_url)]
    );
    return id;
  }
  const ins = await client.query(
    `INSERT INTO salons (user_id, name, email, phone, description, profile_image_url, type, is_approved, registration_step)
     VALUES ($1,$2,$3,$4,$5,$6,'beauty_professional', FALSE, 1)
     RETURNING id`,
    [user_id, toStr(name), toStr(email), toStr(phone), toStr(description), toStr(profile_image_url)]
  );
  return ins.rows[0].id;
}

// ---------- STEP 1 (PUBLIC): create professional user + set cookie ----------
export const proRegister = async (req, res) => {
  const {
    first_name, last_name, email, password,
    country, city, postcode, full_address
  } = req.body || {};

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    const dup = await client.query(`SELECT id FROM users WHERE email=$1`, [email]);
    if (dup.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const ins = await client.query(
      `INSERT INTO users
        (first_name, last_name, email, password, role, login_type, requesting_role, approval_status)
       VALUES ($1,$2,$3,$4,'professional','email','professional','pending')
       RETURNING id, email, role`,
      [first_name, last_name, email, hashed]
    );
    const user = ins.rows[0];

    if (country || city || postcode || full_address) {
      await client.query(
        `INSERT INTO user_addresses (user_id, country, city, postcode, full_address)
         VALUES ($1,$2,$3,$4,$5)`,
        [user.id, toStr(country), toStr(city), toStr(postcode), toStr(full_address)]
      );
    }

    // issue jwt cookie (+ return token as fallback)
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    await client.query("COMMIT");
    res.status(201).json({ message: "Registered", token, user });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("[PRO REGISTER ERROR]", err);
    res.status(400).json({ error: "Registration failed" });
  } finally {
    client.release();
  }
};

// ---------- STEP 2: profile + address + socials + certifications ----------
export const profileStep = async (req, res) => {
  const user_id = req.body.userId;
  const {
    name, email, phone, description,       // profile fields (salons)
    profile_image_url,                     // profile image URL
    address,                               // {country, city, postcode, full_address}
    socialLinks = [],                      // [{platform,url}]
    certifications = []                    // [{certificate, issuedDate, certificationId, certificationUrl}]
    // extra: title, experience, languages (safe to ignore or store elsewhere)
  } = req.body || {};

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    // make sure user is pending professional
    await client.query(
      `UPDATE users SET requesting_role='professional', approval_status='pending', updated_at=NOW()
       WHERE id=$1`,
      [user_id]
    );

    const salon_id = await getOrCreateProSalon(client, user_id, { name, email, phone, description, profile_image_url });

    // upsert address
    if (address && (address.country || address.city || address.postcode || address.full_address)) {
      const { rows: addr } = await client.query(
        `SELECT id FROM salon_addresses WHERE salon_id=$1 AND status=1 LIMIT 1`,
        [salon_id]
      );
      if (addr.length) {
        await client.query(
          `UPDATE salon_addresses SET country=$2, city=$3, postcode=$4, full_address=$5, updated_at=NOW()
           WHERE salon_id=$1`,
          [salon_id, toStr(address.country), toStr(address.city), toStr(address.postcode), toStr(address.full_address)]
        );
      } else {
        await client.query(
          `INSERT INTO salon_addresses (salon_id, country, city, postcode, full_address)
           VALUES ($1,$2,$3,$4,$5)`,
          [salon_id, toStr(address.country), toStr(address.city), toStr(address.postcode), toStr(address.full_address)]
        );
      }
    }

    // replace socials
    await client.query(`DELETE FROM social_links WHERE salon_id=$1`, [salon_id]);
    for (const l of socialLinks) {
      if (!l?.platform || !l?.url?.trim()) continue;
      await client.query(
        `INSERT INTO social_links (salon_id, platform, url) VALUES ($1,$2,$3)`,
        [salon_id, toStr(l.platform), toStr(l.url)]
      );
    }

    // replace certifications
    await client.query(`DELETE FROM certifications WHERE salon_id=$1`, [salon_id]);
    for (const c of certifications) {
      if (!c?.certificate?.trim()) continue;
      await client.query(
        `INSERT INTO certifications (salon_id, certificate_name, issue_date, certificate_id, certificate_url)
         VALUES ($1,$2,$3,$4,$5)`,
        [salon_id, toStr(c.certificate), c.issuedDate ? new Date(c.issuedDate) : null, toStr(c.certificationId), toStr(c.certificationUrl)]
      );
    }

    await client.query(
      `UPDATE salons SET registration_step=GREATEST(registration_step,1), updated_at=NOW() WHERE id=$1`,
      [salon_id]
    );

    await client.query("COMMIT");
    res.json({ message: "Profile saved", salon_id });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("[PRO PROFILE STEP ERROR]", err);
    res.status(400).json({ error: "Could not save profile" });
  } finally {
    client.release();
  }
};

// ---------- STEP 3: portfolios + images (replace-all) ----------
export const portfolioStep = async (req, res) => {
  const user_id = req.body.userId;
  const { salon_id, albums = [] } = req.body || {};

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    // For beauty professionals, salon_id may be null, use user_id instead
    let target_id = salon_id;
    let is_beauty_pro = false;
    if (!salon_id) {
      // Assume beauty professional if no salon_id
      target_id = user_id;
      is_beauty_pro = true;
    } else {
      // Check if salon exists for salon owners
      const { rows: ok } = await client.query(
        `SELECT id FROM salons WHERE id=$1 AND user_id=$2 AND status=1`,
        [salon_id, user_id]
      );
      if (!ok.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Salon not found" });
      }
    }

    // Delete existing portfolios
    if (is_beauty_pro) {
      const { rows: ports } = await client.query(`SELECT id FROM portfolios WHERE user_id=$1`, [target_id]);
      for (const p of ports) await client.query(`DELETE FROM portfolio_images WHERE portfolio_id=$1`, [p.id]);
      await client.query(`DELETE FROM portfolios WHERE user_id=$1`, [target_id]);
    } else {
      const { rows: ports } = await client.query(`SELECT id FROM portfolios WHERE salon_id=$1`, [target_id]);
      for (const p of ports) await client.query(`DELETE FROM portfolio_images WHERE portfolio_id=$1`, [p.id]);
      await client.query(`DELETE FROM portfolios WHERE salon_id=$1`, [target_id]);
    }

    // Insert new portfolios
    for (const a of albums) {
      if (!a?.album_name?.trim()) continue;
      const ins = await client.query(
        `INSERT INTO portfolios (salon_id, user_id, album_name) VALUES ($1,$2,$3) RETURNING id`,
        [is_beauty_pro ? null : target_id, is_beauty_pro ? target_id : null, toStr(a.album_name)]
      );
      const pid = ins.rows[0].id;
      for (const url of a.images || []) {
        if (!url?.trim()) continue;
        await client.query(
          `INSERT INTO portfolio_images (portfolio_id, image_url) VALUES ($1,$2)`,
          [pid, toStr(url)]
        );
      }
    }

    // Update registration step
    if (is_beauty_pro) {
      await client.query(
        `UPDATE users SET registration_step=GREATEST(registration_step,2), updated_at=NOW() WHERE id=$1`,
        [user_id]
      );
    } else {
      await client.query(
        `UPDATE salons SET registration_step=GREATEST(registration_step,2), updated_at=NOW() WHERE id=$1`,
        [salon_id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Portfolio saved" });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("[PRO PORTFOLIO STEP ERROR]", err);
    res.status(400).json({ error: "Could not save portfolio" });
  } finally {
    client.release();
  }
};

// ---------- STEP 4: services (replace-all) ----------
export const servicesStep = async (req, res) => {
  const user_id = req.body.userId;
  const { salon_id, services = [] } = req.body || {};

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    // For beauty professionals, salon_id may be null, use user_id instead
    let target_id = salon_id;
    let is_beauty_pro = false;
    if (!salon_id) {
      // Assume beauty professional if no salon_id
      target_id = user_id;
      is_beauty_pro = true;
    } else {
      // Check if salon exists for salon owners
      const { rows: ok } = await client.query(
        `SELECT id FROM salons WHERE id=$1 AND user_id=$2 AND status=1`,
        [salon_id, user_id]
      );
      if (!ok.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Salon not found" });
      }
    }

    // Delete existing services
    if (is_beauty_pro) {
      await client.query(`DELETE FROM services WHERE user_id=$1`, [target_id]);
    } else {
      await client.query(`DELETE FROM services WHERE salon_id=$1`, [target_id]);
    }

    // Handle image uploads
    const imageUrls = {};
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const match = file.fieldname.match(/services\[(\d+)\]\[image\]/);
        if (match) {
          const index = match[1];
          // Upload image
          let imageUrl;
          if (process.env.NODE_ENV === "production") {
            const { put } = await import("@vercel/blob");
            const safeName = (file.originalname || "service").replace(/\s+/g, "_");
            const key = `services/${Date.now()}-${safeName}`;
            const result = await put(key, file.buffer, {
              access: "public",
              contentType: file.mimetype,
            });
            imageUrl = result.url;
          } else {
            imageUrl = `/uploads/${file.filename}`;
          }
          imageUrls[index] = imageUrl;
        }
      }
    }

    // Insert new services
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      if (!s?.serviceName?.trim()) continue;
      const duration = minutesFromLabel(s.durationLabel ?? s.duration) || null;
      const imageUrl = imageUrls[i] || null;

      await client.query(
        `INSERT INTO services (salon_id, user_id, name, duration, price, discounted_price, description, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          is_beauty_pro ? null : target_id,
          is_beauty_pro ? target_id : null,
          toStr(s.serviceName),
          duration,
          toMoney(s.price),
          toMoney(s.discountedPrice),
          toStr(s.description),
          imageUrl
        ]
      );
    }

    // Update registration step
    if (is_beauty_pro) {
      await client.query(
        `UPDATE users SET registration_step=GREATEST(registration_step,3), updated_at=NOW() WHERE id=$1`,
        [user_id]
      );
    } else {
      await client.query(
        `UPDATE salons SET registration_step=GREATEST(registration_step,3), updated_at=NOW() WHERE id=$1`,
        [salon_id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Services saved" });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("[PRO SERVICES STEP ERROR]", err);
    res.status(400).json({ error: "Could not save services" });
  } finally {
    client.release();
  }
};

// ---------- STEP 5: FAQs + submit ----------
export const faqsStep = async (req, res) => {
  const user_id = req.body.userId;
  const { salon_id, faqs = [] } = req.body || {};

  const client = await db.getClient();
  try {
    await client.query("BEGIN");

    // For beauty professionals, salon_id may be null, use user_id instead
    let target_id = salon_id;
    let is_beauty_pro = false;
    if (!salon_id) {
      // Assume beauty professional if no salon_id
      target_id = user_id;
      is_beauty_pro = true;
    } else {
      // Check if salon exists for salon owners
      const { rows: ok } = await client.query(
        `SELECT id FROM salons WHERE id=$1 AND user_id=$2 AND status=1`,
        [salon_id, user_id]
      );
      if (!ok.length) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Salon not found" });
      }
    }

    // Delete existing FAQs
    if (is_beauty_pro) {
      await client.query(`DELETE FROM faqs WHERE user_id=$1`, [target_id]);
    } else {
      await client.query(`DELETE FROM faqs WHERE salon_id=$1`, [target_id]);
    }

    // Insert new FAQs
    for (const f of faqs) {
      if (!f?.question?.trim()) continue;
      await client.query(
        `INSERT INTO faqs (salon_id, user_id, question, answer) VALUES ($1,$2,$3,$4)`,
        [is_beauty_pro ? null : target_id, is_beauty_pro ? target_id : null, toStr(f.question), toStr(f.answer)]
      );
    }

    // Update registration step
    if (is_beauty_pro) {
      await client.query(
        `UPDATE users SET registration_step=GREATEST(registration_step,4), approval_status='pending', updated_at=NOW() WHERE id=$1`,
        [user_id]
      );
    } else {
      await client.query(
        `UPDATE salons SET registration_step=GREATEST(registration_step,4), updated_at=NOW() WHERE id=$1`,
        [salon_id]
      );
      await client.query(
        `UPDATE users SET approval_status='pending', updated_at=NOW() WHERE id=$1`,
        [user_id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Submitted for approval" });
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("[PRO FAQ STEP ERROR]", err);
    res.status(400).json({ error: "Could not submit FAQs" });
  } finally {
    client.release();
  }
};

// ---------- Helper ----------
export const myProProfile = async (req, res) => {
  const user_id = req.body.userId;
  try {
    const { rows: salons } = await db.query(
      `SELECT * FROM salons WHERE user_id=$1 AND type='beauty_professional' AND status=1 LIMIT 1`,
      [user_id]
    );
    if (!salons.length) return res.json({ profile: null });
    const salon = salons[0];

    const [{ rows: addr }, { rows: socials }, { rows: certs }, { rows: ports }, { rows: svcs }, { rows: faqRows }] =
      await Promise.all([
        db.query(`SELECT * FROM salon_addresses WHERE salon_id=$1 AND status=1`, [salon.id]),
        db.query(`SELECT * FROM social_links WHERE salon_id=$1 AND status=1`, [salon.id]),
        db.query(`SELECT * FROM certifications WHERE salon_id=$1 AND status=1`, [salon.id]),
        db.query(`
          SELECT p.id, p.album_name, COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
          FROM portfolios p
          LEFT JOIN portfolio_images pi ON pi.portfolio_id = p.id
          WHERE p.salon_id = $1 OR (p.salon_id IS NULL AND p.user_id = $2)
          GROUP BY p.id
          ORDER BY p.id ASC
        `, [salon.id, user_id]),
        db.query(`SELECT * FROM services WHERE salon_id=$1 AND status=1 OR (salon_id IS NULL AND user_id=$2 AND status=1)`, [salon.id, user_id]),
        db.query(`SELECT * FROM faqs WHERE salon_id=$1 AND status=1 OR (salon_id IS NULL AND user_id=$2 AND status=1) ORDER BY id ASC`, [salon.id, user_id]),
      ]);

    res.json({
      profile: {
        salon,
        address: addr[0] || null,
        socialLinks: socials,
        certifications: certs,
        portfolios: ports,
        services: svcs,
        faqs: faqRows
      }
    });
  } catch (err) {
    console.error("[PRO GET ME ERROR]", err);
    res.status(500).json({ error: "Failed to load profile" });
  }
};
