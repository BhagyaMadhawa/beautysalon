import bcrypt from "bcryptjs";
import db from "../db.js";

// ✅ Step 1: Create Salon Owner User
export const ownerStep1 = async (req, res) => {
  try {
    const { first_name, last_name, email, password, country, city, postcode, full_address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, role, status, country, city, postcode, full_address)
       VALUES ($1,$2,$3,$4,'owner','pending',$5,$6,$7,$8) RETURNING id`,
      [first_name, last_name, email, hashedPassword, country, city, postcode, full_address]
    );

    res.json({ user_id: result.rows[0].id });
  } catch (err) {
    console.error("[OWNER STEP1 ERROR]", err);
    res.status(500).json({ error: "Failed to register owner" });
  }
};

// ✅ Step 2: Salon Details
export const ownerStep2 = async (req, res) => {
  try {
    const { user_id, salon_name, phone, description, country, city, postcode, full_address } = req.body;

    const result = await db.query(
      `INSERT INTO salons (user_id, name, phone, description, country, city, postcode, full_address, approved)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) RETURNING id`,
      [user_id, salon_name, phone, description, country, city, postcode, full_address]
    );

    res.json({ salon_id: result.rows[0].id });
  } catch (err) {
    console.error("[OWNER STEP2 ERROR]", err);
    res.status(500).json({ error: "Failed to save salon details" });
  }
};

// ✅ Step 3: Services
export const ownerStep3 = async (req, res) => {
  try {
    const { salon_id, services } = req.body; // array of {name, price}

    for (let s of services) {
      await db.query(
        `INSERT INTO services (salon_id, name, price) VALUES ($1,$2,$3)`,
        [salon_id, s.name, s.price]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[OWNER STEP3 ERROR]", err);
    res.status(500).json({ error: "Failed to save services" });
  }
};

// ✅ Step 4: Team
export const ownerStep4 = async (req, res) => {
  try {
    const { salon_id, team } = req.body;

    for (let t of team) {
      await db.query(
        `INSERT INTO team_members (salon_id, name, role) VALUES ($1,$2,$3)`,
        [salon_id, t.name, t.role]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[OWNER STEP4 ERROR]", err);
    res.status(500).json({ error: "Failed to save team" });
  }
};

// ✅ Step 5: Gallery
export const ownerStep5 = async (req, res) => {
  try {
    const { salon_id, photos } = req.body; // array of {url}

    for (let p of photos) {
      await db.query(
        `INSERT INTO salon_gallery (salon_id, photo_url) VALUES ($1,$2)`,
        [salon_id, p.url]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("[OWNER STEP5 ERROR]", err);
    res.status(500).json({ error: "Failed to save gallery" });
  }
};

// ✅ Step 6: Finalize
export const ownerStep6 = async (req, res) => {
  try {
    const { user_id } = req.body;

    await db.query(
      `UPDATE users SET status='pending_admin_approval' WHERE id=$1`,
      [user_id]
    );

    res.json({ success: true, message: "Salon registration submitted for admin approval." });
  } catch (err) {
    console.error("[OWNER STEP6 ERROR]", err);
    res.status(500).json({ error: "Failed to finalize registration" });
  }
};
