import db from "../db.js";

// Helper function to update registration step
const updateRegistrationStep = async (userId, step) => {
  await db.query(
    `UPDATE users SET registration_step = $1 WHERE id = $2 AND role = 'service_provider'`,
    [step, userId]
  );
};

// Step 1: Create Beauty Professional Profile
const createBeautyPro = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    description,
    country,
    city,
    postcode,
    fullAddress,
    social_links,
    certifications,
    registration_step
  } = req.body;

  const profileImage = req.file ? req.file.path : null;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password and confirm password do not match" });
  }

  try {
    // Create user with role = 'service_provider' and registration_step
    const userResult = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, role, login_type, profile_image_url, registration_step)
       VALUES ($1, $2, $3, $4, 'service_provider', 'email', $5, $6) RETURNING id`,
      [firstName, lastName, uemail, password, profileImage, registration_step || 1]
    );

    const userId = userResult.rows[0].id;

    // Address
    await db.query(
      `INSERT INTO user_addresses (user_id, country, city, postcode, full_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, country, city, postcode, fullAddress]
    );

    // Social links
    if (social_links) {
      const parsedLinks = JSON.parse(social_links);
      for (const link of parsedLinks) {
        await db.query(
          `INSERT INTO social_links (salon_id, platform, url) VALUES ($1, $2, $3)`,
          [null, link.platform, link.url]
        );
      }
    }

    // Certifications
    if (certifications) {
      const parsedCerts = JSON.parse(certifications);
      for (const cert of parsedCerts) {
        await db.query(
          `INSERT INTO certifications (salon_id, certificate_name, issue_date, certificate_id, certificate_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [null, cert.certificate_name, cert.issue_date, cert.certificate_id, cert.certificate_url]
        );
      }
    }

    res.status(201).json({ message: "Beauty profile created", user_id: userId });
  } catch (err) {
    console.error("Error creating beauty professional:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 2: Add Portfolio
const createPortfolio = async (req, res) => {
  const { userId } = req.params;
  const { albums } = req.body;

  try {
    for (const album of albums) {
      const { rows } = await db.query(
        `INSERT INTO portfolios (salon_id, album_name)
         VALUES (NULL, $1) RETURNING id`,
        [album.album_name]
      );

      const portfolioId = rows[0].id;

      for (const img of album.images) {
        await db.query(
          `INSERT INTO portfolio_images (portfolio_id, image_url)
           VALUES ($1, $2)`,
          [portfolioId, img]
        );
      }
    }

    // Update registration step to 2
    await updateRegistrationStep(userId, 2);

    res.status(201).json({ message: "Portfolio created" });
  } catch (err) {
    console.error("Error creating portfolio:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 3: Add Services
const createServices = async (req, res) => {
  const { userId } = req.params;
  const { services } = req.body;

  try {
    for (const svc of services) {
      await db.query(
        `INSERT INTO services (salon_id, name, duration, price, discounted_price, description)
         VALUES (NULL, $1, $2, $3, $4, $5)`,
        [svc.name, svc.duration, svc.price, svc.discounted_price, svc.description]
      );
    }

    res.status(201).json({ message: "Services added" });
  } catch (err) {
    console.error("Error adding services:", err);
    res.status(500).json({ error: err.message });
  }
};

const addFaqs = async (req, res) => {
  const { userId } = req.params;
  const { faqs } = req.body;

  try {
    for (const faq of faqs) {
      await db.query(
        `INSERT INTO faqs (salon_id, question, answer)
         VALUES (NULL, $1, $2)`,
        [faq.question, faq.answer]
      );
    }

    res.status(201).json({ message: "FAQs added" });
  } catch (err) {
    console.error("Error adding FAQs:", err);
    res.status(500).json({ error: err.message });
  }
};

const approveBeautyPro = async (req, res) => {
  const { userId } = req.params;

  try {
    await db.query(
      `UPDATE users SET status = 1 WHERE id = $1 AND role = 'service_provider'`,
      [userId]
    );

  res.json({ message: "Beauty Professional approved" });
  } catch (err) {
    console.error("Error approving beauty pro:", err);
    res.status(500).json({ error: err.message });
  }
};

export default {
  createBeautyPro,
  createPortfolio,
  createServices,
  addFaqs,
  approveBeautyPro
};
