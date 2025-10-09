import bcrypt from 'bcrypt';
import db from '../db.js';

// Helper function to update registration step
const updateRegistrationStep = async (salonId, step) => {
  await db.query(
    `UPDATE salons SET registration_step = $1 WHERE id = $2`,
    [step, salonId]
  );
};

// register the owner step 1

export const createSalonOwner = async (req, res) => {
  const { first_name, last_name, email, password, country, city, postcode, full_address, login_type, profile_image_url } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !password || !country || !city || !postcode || !full_address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check for existing email
    const { rows: existing } = await client.query(
      'SELECT 1 FROM users WHERE email = $1',
      [normalizedEmail]
    );
    if (existing.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with registration_step = 1
    const { rows } = await client.query(
      `INSERT INTO users (first_name, last_name, email, password, login_type, requesting_role, profile_image_url, registration_step, role, approval_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING id`,
      [first_name, last_name, normalizedEmail, hashedPassword, login_type || 'email', 'owner', profile_image_url || null, 1, 'pending']
    );

    const userId = rows[0].id;

    // Insert user address
    await client.query(
      `INSERT INTO user_addresses (user_id, country, city, postcode, full_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, country, city, postcode, full_address]
    );

    await client.query('COMMIT');

    res.status(201).json({ message: "User created", user_id: userId });
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('[CREATE_SALON_OWNER ERROR]', err);
    res.status(500).json({ error: 'Failed to create salon owner' });
  } finally {
    client.release();
  }
};


// Step 2: Create Salon (basic info, address, social links)
export const createSalon = async (req, res) => {
  const {  name,user_id, email, phone, description, type, addresses, social_links } = req.body;

  try {
    // Insert salon
    const { rows } = await db.query(
      `INSERT INTO salons ( name, email,user_id,phone ,description , type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [ name, email,user_id, phone, description, type]
    );

    const id = rows[0].id;

    // Insert addresses
    for (const addr of addresses) {
      await db.query(
        `INSERT INTO salon_addresses (salon_id, country, city, postcode, full_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [ id,addr.country, addr.city, addr.postcode, addr.full_address]
      );
    }

    // Insert social links
    for (const link of social_links) {
      await db.query(
        `INSERT INTO social_links (salon_id, platform, url)
         VALUES ($1, $2, $3)`,
        [id, link.platform, link.url]
      );
    }

    res.status(201).json({ message: "Salon created", salon_id: id });
  } catch (err) {
    console.error("Error creating salon:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 3: Add Portfolios (albums + images)
export const createPortfolio = async (req, res) => {
  const { salonId } = req.params;
  const { albums } = req.body;

  try {
    for (const album of albums) {
      const { rows } = await db.query(
        `INSERT INTO portfolios (salon_id, album_name)
         VALUES ($1, $2) RETURNING id`,
        [salonId, album.album_name]
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
    await updateRegistrationStep(salonId, 2);

    res.status(201).json({ message: "Portfolio created" });
  } catch (err) {
    console.error("Error creating portfolio:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 4: Add Services
export const createServices = async (req, res) => {
  const { salonId } = req.params;
  const { services } = req.body;

  try {
    for (const svc of services) {
      await db.query(
        `INSERT INTO services (salon_id, name, duration, price, discounted_price, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [salonId, svc.name, svc.duration, svc.price, svc.discounted_price, svc.description]
      );
    }

    // Update registration step to 3
    await updateRegistrationStep(salonId, 3);

    res.status(201).json({ message: "Services added" });
  } catch (err) {
    console.error("Error adding services:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 5: Set Operating Hours
export const setOperatingHours = async (req, res) => {
  const { salonId } = req.params;
  const { hours } = req.body;

  try {
    for (const h of hours) {
      await db.query(
        `INSERT INTO opening_hours (salon_id, day_of_week, is_opened, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [salonId, h.day_of_week, h.is_opened, h.start_time || null, h.end_time || null]
      );
    }

    // Update registration step to 4
    await updateRegistrationStep(salonId, 4);

    res.status(201).json({ message: "Operating hours set" });
  } catch (err) {
    console.error("Error setting hours:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 6 : Add FAQs
export const addFaqs = async (req, res) => {
  const { salonId } = req.params;
  const { faqs } = req.body;

  try {
    for (const faq of faqs) {
      await db.query(
        `INSERT INTO faqs (salon_id, question, answer)
         VALUES ($1, $2, $3)`,

        [salonId, faq.question, faq.answer]
      );
    }

    // Update registration step to 
    await updateRegistrationStep(salonId, 5);

    res.status(201).json({ message: "FAQs added" });
  } catch (err) {
    console.error("Error adding FAQs:", err);
    res.status(500).json({ error: err.message });
  }
};

// Step 6: Admin Approves Salon
export const approveSalon = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(
      `UPDATE salons SET is_approved = TRUE WHERE id = $1`,
      [id]
    );

    res.json({ message: "Salon approved" });
  } catch (err) {
    console.error("Error approving salon:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get salon details
export const getSalon = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Get salon details with address information
    const { rows } = await db.query(
      ` SELECT
        s.*,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        sa.country,
        sa.city,
        sa.full_address,
        COUNT(r.id) as total_reviews,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM salons s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN salon_addresses sa ON s.id = sa.salon_id AND sa.status = 1
      LEFT JOIN reviews r ON s.id = r.salon_id AND r.status = 1
      WHERE s.is_approved = TRUE AND s.id = $1 AND s.status = 1
      GROUP BY s.id, u.id, sa.id
    `,
      [salonId]
    );

    console.log("Database query result:", rows); // Debug log

    if (rows.length === 0) {
      return res.status(404).json({ error: "Salon not found" });
    }

    const salon = rows[0];
    console.log("Salon data with address:", salon); // Debug log
    
   

    // Calculate local time (simplified - would need timezone info for accurate calculation)
    const now = new Date();
    const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Prepare response with all required data for profile card
    const salonData = {
       id: salon.id,
      name: salon.name,
      description: salon.description,
      profile_image_url: salon.profile_image_url,
      average_rating: parseFloat(salon.average_rating) || 0,
      total_reviews: parseInt(salon.total_reviews) || 0,
      location: salon.full_address ? `${salon.city}, ${salon.country}` : 'Location not specified',
      user_id: salon.user_id,
      owner: {
        first_name: salon.first_name,
        last_name: salon.last_name,
        profile_image: salon.owner_profile_image
      }
    };

    res.json({ salon: salonData });
  } catch (err) {
    console.error("Error fetching salon:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get services for a salon
export const getServices = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM services 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    res.json({ services: rows });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get portfolios for a salon
export const getPortfolios = async (req, res) => {
  const { salonId } = req.params;

  try {
    // Get portfolios with their images
    const { rows } = await db.query(`
      SELECT 
        p.id as portfolio_id,
        p.album_name,
        p.created_at,
        json_agg(
          json_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'created_at', pi.created_at
          )
        ) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM portfolios p
      LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
      WHERE p.salon_id = $1 AND p.status = 1 AND (pi.status = 1 OR pi.status IS NULL)
      GROUP BY p.id, p.album_name, p.created_at
      ORDER BY p.created_at DESC
    `, [salonId]);

    res.json({ portfolios: rows });
  } catch (err) {
    console.error("Error fetching portfolios:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get FAQs for a salon
export const getFaqs = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM faqs 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    res.json({ faqs: rows });
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get operating hours for a salon
export const getOperatingHours = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM opening_hours 
       WHERE salon_id = $1 AND status = 1
       ORDER BY 
         CASE day_of_week
           WHEN 'Monday' THEN 1
           WHEN 'Tuesday' THEN 2
           WHEN 'Wednesday' THEN 3
           WHEN 'Thursday' THEN 4
           WHEN 'Friday' THEN 5
           WHEN 'Saturday' THEN 6
           WHEN 'Sunday' THEN 7
         END`,
      [salonId]
    );

    res.json({ operatingHours: rows });
  } catch (err) {
    console.error("Error fetching operating hours:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get social links for a salon
export const getSocialLinks = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM social_links 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    res.json({ socialLinks: rows });
  } catch (err) {
    console.error("Error fetching social links:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get salon addresses
export const getSalonAddresses = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM salon_addresses
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    res.json({ addresses: rows });
  } catch (err) {
    console.error("Error fetching salon addresses:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE FUNCTIONS FOR DASHBOARD EDITING

// Update salon basic information
export const updateSalon = async (req, res) => {
  const { salonId } = req.params;
  const { name, email, phone, description, type } = req.body;

  try {
    // Verify ownership - check if user owns this salon
    const ownershipCheck = await db.query(
      'SELECT id FROM salons WHERE id = $1 AND user_id = $2 AND status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update salon information
    await db.query(
      `UPDATE salons
       SET name = $1, email = $2, phone = $3, description = $4, type = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [name, email, phone, description, type, salonId]
    );

    res.json({ message: 'Salon information updated successfully' });
  } catch (err) {
    console.error("Error updating salon:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update salon address
export const updateSalonAddress = async (req, res) => {
  const { salonId, addressId } = req.params;
  const { country, city, postcode, full_address } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update address
    await db.query(
      `UPDATE salon_addresses
       SET country = $1, city = $2, postcode = $3, full_address = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND salon_id = $6 AND status = 1`,
      [country, city, postcode, full_address, addressId, salonId]
    );

    res.json({ message: 'Salon address updated successfully' });
  } catch (err) {
    console.error("Error updating salon address:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update social link
export const updateSocialLink = async (req, res) => {
  const { salonId, linkId } = req.params;
  const { platform, url } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update social link
    await db.query(
      `UPDATE social_links
       SET platform = $1, url = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND salon_id = $4 AND status = 1`,
      [platform, url, linkId, salonId]
    );

    res.json({ message: 'Social link updated successfully' });
  } catch (err) {
    console.error("Error updating social link:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  const { salonId, serviceId } = req.params;
  const { name, duration, price, discounted_price, description } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update service
    await db.query(
      `UPDATE services
       SET name = $1, duration = $2, price = $3, discounted_price = $4, description = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND salon_id = $7 AND status = 1`,
      [name, duration, price, discounted_price, description, serviceId, salonId]
    );

    res.json({ message: 'Service updated successfully' });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete service (soft delete)
export const deleteService = async (req, res) => {
  const { salonId, serviceId } = req.params;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Soft delete service
    await db.query(
      'UPDATE services SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND salon_id = $2',
      [serviceId, salonId]
    );

    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update portfolio album name
export const updatePortfolio = async (req, res) => {
  const { salonId, portfolioId } = req.params;
  const { album_name } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update portfolio album name
    await db.query(
      `UPDATE portfolios
       SET album_name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND salon_id = $3 AND status = 1`,
      [album_name, portfolioId, salonId]
    );

    res.json({ message: 'Portfolio updated successfully' });
  } catch (err) {
    console.error("Error updating portfolio:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add images to portfolio
export const addPortfolioImages = async (req, res) => {
  const { salonId, portfolioId } = req.params;
  const { images } = req.body; // Array of image URLs

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Insert new images
    for (const imageUrl of images) {
      await db.query(
        `INSERT INTO portfolio_images (portfolio_id, image_url)
         VALUES ($1, $2)`,
        [portfolioId, imageUrl]
      );
    }

    res.json({ message: `${images.length} images added to portfolio successfully` });
  } catch (err) {
    console.error("Error adding portfolio images:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete portfolio image
export const deletePortfolioImage = async (req, res) => {
  const { salonId, imageId } = req.params;

  try {
    // Verify salon ownership through portfolio
    const ownershipCheck = await db.query(
      `SELECT s.id FROM salons s
       JOIN portfolios p ON s.id = p.salon_id
       JOIN portfolio_images pi ON p.id = pi.portfolio_id
       WHERE s.user_id = $1 AND pi.id = $2 AND s.status = 1 AND p.status = 1`,
      [req.user.id, imageId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Soft delete image
    await db.query(
      'UPDATE portfolio_images SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [imageId]
    );

    res.json({ message: 'Portfolio image deleted successfully' });
  } catch (err) {
    console.error("Error deleting portfolio image:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete entire portfolio (soft delete)
export const deletePortfolio = async (req, res) => {
  const { salonId, portfolioId } = req.params;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Soft delete portfolio and all its images
    await db.query(
      'UPDATE portfolios SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND salon_id = $2',
      [portfolioId, salonId]
    );

    await db.query(
      'UPDATE portfolio_images SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE portfolio_id = $1',
      [portfolioId]
    );

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    console.error("Error deleting portfolio:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update FAQ
export const updateFaq = async (req, res) => {
  const { salonId, faqId } = req.params;
  const { question, answer } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Update FAQ
    await db.query(
      `UPDATE faqs
       SET question = $1, answer = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND salon_id = $4 AND status = 1`,
      [question, answer, faqId, salonId]
    );

    res.json({ message: 'FAQ updated successfully' });
  } catch (err) {
    console.error("Error updating FAQ:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete FAQ (soft delete)
export const deleteFaq = async (req, res) => {
  const { salonId, faqId } = req.params;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Soft delete FAQ
    await db.query(
      'UPDATE faqs SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND salon_id = $2',
      [faqId, salonId]
    );

    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    console.error("Error deleting FAQ:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get certifications for a salon
export const getCertifications = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM certifications 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

   // Transform the data to match frontend expectations
     const transformedCertifications = rows.map(cert => ({
       id: cert.id,
        title: cert.certificate_name,
        description: cert.certificate_id ? `Certificate ID: ${cert.certificate_id}` : 'Professional certification',
        issue_date: cert.issue_date,
        certificate_url: cert.certificate_url,
        created_at: cert.created_at
    }));

    res.json({ certifications: transformedCertifications });
  
  } catch (err) {
    console.error("Error fetching certifications:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get key information for a salon
export const getKeyInfo = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM salon_key_info 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    // Return the first record or empty object if none found
    res.json({ keyInfo: rows[0] || {} });
  } catch (err) {
    console.error("Error fetching key information:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get languages for a salon
export const getLanguages = async (req, res) => {
  const { salonId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT * FROM salon_languages 
       WHERE salon_id = $1 AND status = 1
       ORDER BY created_at DESC`,
      [salonId]
    );

    res.json({ languages: rows });
  } catch (err) {
    console.error("Error fetching languages:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get salon by user ID (for dashboard)
export const getSalonByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT id, name, email, phone, description, type, is_approved, created_at
       FROM salons
       WHERE user_id = $1 AND status = 1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No salon found for this user" });
    }

    res.json({ salon: rows[0] });
  } catch (err) {
    console.error("Error fetching salon by user ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get random salons for home page (approved salons only)
export const getRandomSalons = async (req, res) => {
  console.log("Incoming request parameters:", req.query);
  const limit = parseInt(req.query.limit) || 8;
  
  console.log("Limit parameter:", req.query.limit);
  console.log("Parsed limit:", limit);

  try {
    const { rows } = await db.query(`
      SELECT 
        s.*,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        sa.country,
        sa.city,
        sa.full_address,
        COUNT(r.id) as total_reviews,
        COALESCE(AVG(r.rating), 0) as average_rating
      FROM salons s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN salon_addresses sa ON s.id = sa.salon_id AND sa.status = 1
      LEFT JOIN reviews r ON s.id = r.salon_id AND r.status = 1
      WHERE s.is_approved = TRUE AND s.status = 1
      GROUP BY s.id, u.id, sa.id
      ORDER BY RANDOM()
      LIMIT $1
    `, [limit]);

    // Format the response with proper salon data
    const salons = rows.map(salon => ({
      id: salon.id,
      name: salon.name,
      description: salon.description,
      profile_image_url: salon.profile_image_url,
      average_rating: parseFloat(salon.average_rating) || 0,
      total_reviews: parseInt(salon.total_reviews) || 0,
      location: salon.full_address ? `${salon.city}, ${salon.country}` : 'Location not specified',
      owner: {
        first_name: salon.first_name,
        last_name: salon.last_name,
        profile_image: salon.owner_profile_image
      }
    }));

    res.json({ salons });
  } catch (err) {
    console.error("Error fetching random salons:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get filtered services for search functionality
export const getFilteredServices = async (req, res) => {
  try {
    const {
      searchTerm = '',
      minRating = 0,
      maxPrice = 1000,
      minPrice = 0,
      services = [],
      location = '',
      page = 1,
      limit = 10
    } = req.query;

    // Check if any filters are applied
    if (!searchTerm && minRating <= 0 && services.length === 0 && !location) {
        // If no filters, return all services
        const allServicesQuery = `
            SELECT 
                s.*,
                sal.name as salon_name,
                sal.profile_image_url as salon_image,
                sal.average_rating,
                sal.total_reviews,
                u.first_name,
                u.last_name,
                u.profile_image_url as owner_profile_image,
                sa.country,
                sa.city,
                sa.full_address
            FROM services s
            LEFT JOIN salons sal ON s.salon_id = sal.id
            LEFT JOIN users u ON sal.user_id = u.id
            LEFT JOIN salon_addresses sa ON sal.id = sa.salon_id AND sa.status = 1
            WHERE s.status = 1 AND sal.status = 1
        `;
        
        const { rows } = await db.query(allServicesQuery);
        
        // Format the response to match ServiceCard component expectations
        const formattedResults = rows.map(service => {
            const images = [
                service.salon_image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80"
            ];

            return {
                id: service.id,
                name: service.name,
                description: service.description,
                duration: service.duration,
                price: parseFloat(service.price),
                discounted_price: service.discounted_price ? parseFloat(service.discounted_price) : null,
                images: images,
                experience: `${Math.floor(Math.random() * 10) + 1} years experience`, // Placeholder
                languages: ['English', 'Spanish'], // Placeholder
                location: service.full_address ? `${service.city}, ${service.country}` : 'Location not specified',
                specialties: [service.name, 'Beauty', 'Wellness'], // Placeholder based on service name
                rating: parseFloat(service.average_rating) || 4.5, // Use salon rating
                reviews: parseInt(service.total_reviews) || Math.floor(Math.random() * 100) + 1, // Use salon reviews or placeholder
                salon: {
                    id: service.salon_id,
                    name: service.salon_name,
                    profile_image_url: service.salon_image,
                    average_rating: parseFloat(service.average_rating) || 0,
                    total_reviews: parseInt(service.total_reviews) || 0,
                    owner: {
                        first_name: service.first_name,
                        last_name: service.last_name,
                        profile_image: service.owner_profile_image
                    }
                }
            };
        });

        return res.json({
            services: formattedResults,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalCount: formattedResults.length,
                hasNext: false,
                hasPrev: false
            }
        });
    }

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.*,
        sal.name as salon_name,
        sal.profile_image_url as salon_image,
        sal.average_rating,
        sal.total_reviews,
        u.first_name,
        u.last_name,
        u.profile_image_url as owner_profile_image,
        sa.country,
        sa.city,
        sa.full_address
      FROM services s
      LEFT JOIN salons sal ON s.salon_id = sal.id
      LEFT JOIN users u ON sal.user_id = u.id
      LEFT JOIN salon_addresses sa ON sal.id = sa.salon_id AND sa.status = 1
      WHERE s.status = 1 AND sal.status = 1
    `;

    const params = [];
    let paramIndex = 1;

    // Add search term filter
    if (searchTerm) {
      query += ` AND (s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
      params.push(`%${searchTerm}%`);
      paramIndex++;
    }

    // Add rating filter
    if (minRating > 0) {
      query += ` AND sal.average_rating >= $${paramIndex}`;
      params.push(parseFloat(minRating));
      paramIndex++;
    }

    // Add price range filter
    query += ` AND s.price BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
    params.push(parseFloat(minPrice), parseFloat(maxPrice));
    paramIndex += 2;

    // Add services filter
    if (services.length > 0) {
      const serviceParams = services.map((_, i) => `$${paramIndex + i}`).join(',');
      query += ` AND s.name IN (${serviceParams})`;
      params.push(...services);
      paramIndex += services.length;
    }

    // Add location filter
    if (location) {
      query += ` AND (sa.city ILIKE $${paramIndex} OR sa.country ILIKE $${paramIndex})`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Get total count for pagination
    const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) FROM');
    const { rows: countRows } = await db.query(countQuery, params);
    const totalCount = parseInt(countRows[0]?.count || 0);

    // Add ordering and pagination
    query += ` ORDER BY sal.average_rating DESC, s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), offset);

    const { rows } = await db.query(query, params);
    
    // Existing filtering logic remains unchanged
    const formattedResults = rows.map(service => {
      // Get portfolio images for the service's salon
      // This would need to be fetched separately or included in the query
      // For now, using placeholder images
      const images = [
        service.salon_image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80"
      ];

      // Map to ServiceCard expected structure
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: parseFloat(service.price),
        discounted_price: service.discounted_price ? parseFloat(service.discounted_price) : null,
        // ServiceCard expected fields
        images: images,
        experience: `${Math.floor(Math.random() * 10) + 1} years experience`, // Placeholder
        languages: ['English', 'Spanish'], // Placeholder
        location: service.full_address ? `${service.city}, ${service.country}` : 'Location not specified',
        specialties: [service.name, 'Beauty', 'Wellness'], // Placeholder based on service name
        rating: parseFloat(service.average_rating) || 4.5, // Use salon rating
        reviews: parseInt(service.total_reviews) || Math.floor(Math.random() * 100) + 1, // Use salon reviews or placeholder
        // Include salon info for reference
        salon: {
          id: service.salon_id,
          name: service.salon_name,
          profile_image_url: service.salon_image,
          average_rating: parseFloat(service.average_rating) || 0,
          total_reviews: parseInt(service.total_reviews) || 0,
          owner: {
            first_name: service.first_name,
            last_name: service.last_name,
            profile_image: service.owner_profile_image
          }
        }
      };
    });

    console.log("Filtered services response:", {
      services: formattedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
    
    res.json({
      services: formattedResults,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (err) {
    console.error("Error fetching filtered services:", err);
    res.status(500).json({ error: err.message });
  }
};


// --- salons for Search
export const getFilteredSalons = async (req, res) => {
  try {
    const {
      searchTerm = '',
      minRating = 0,
      location = '',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const lim = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const offset = (pageNum - 1) * lim;

    const st = String(searchTerm).trim();
    const loc = String(location).trim();
    const minR = Number(minRating) || 0;

    let query = `
      SELECT 
          s.id,
          s.name,
          s.description,
          s.profile_image_url,
          COALESCE(AVG(r.rating), 0)::float AS average_rating,
          COUNT(r.id)::int AS total_reviews,
          sa.country,
          sa.city,
          sa.full_address,
          (
            SELECT json_agg(pi.image_url) 
            FROM (
              SELECT pi.image_url 
              FROM portfolios p 
              JOIN portfolio_images pi ON pi.portfolio_id = p.id AND pi.status = 1
              WHERE p.salon_id = s.id AND p.status = 1
              ORDER BY pi.created_at DESC
              LIMIT 6
            ) as pi
          ) as images
      FROM salons s
      LEFT JOIN salon_addresses sa ON sa.salon_id = s.id AND sa.status = 1
      LEFT JOIN reviews r ON r.salon_id = s.id AND r.status = 1
      WHERE s.status = 1 
    `;

    const params = [];
    let i = 1;

    if (st) {
      query += ` AND (s.name ILIKE $${i} OR s.description ILIKE $${i})`;
      params.push(`%${st}%`);
      i++;
    }

    if (loc) {
      query += ` AND (sa.city ILIKE $${i} OR sa.country ILIKE $${i} OR sa.full_address ILIKE $${i})`;
      params.push(`%${loc}%`);
      i++;
    }

    query += ` GROUP BY s.id, sa.country, sa.city, sa.full_address`;

    if (minR > 0) {
      query += ` HAVING COALESCE(AVG(r.rating), 0) >= $${i}`;
      params.push(minR);
      i++;
    }

    const countQuery = `
      SELECT COUNT(*)::int AS total_count FROM (${query}) subq
    `;
    const { rows: countRows } = await db.query(countQuery, params);
    const totalCount = countRows[0]?.total_count ?? 0;

    query += ` ORDER BY average_rating DESC, total_reviews DESC, s.id DESC
               LIMIT $${i} OFFSET $${i + 1}`;
    const dataParams = [...params, lim, offset];

    const { rows } = await db.query(query, dataParams);

    const salons = rows.map(s => {
      const images = Array.isArray(s.images) && s.images.length
        ? s.images
        : [ s.profile_image_url || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80" ];

      return {
        id: s.id,
        name: s.name,
        description: s.description,
        images,
        experience: "",
        languages: ['English'],
        location: s.full_address ? `${s.city}, ${s.country}` : 'Location not specified',
        specialties: [],
        rating: s.average_rating || 0,
        reviews: s.total_reviews || 0
      };
    });

    res.json({
      salons,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.max(Math.ceil(totalCount / lim), 1),
        totalCount,
        hasNext: pageNum * lim < totalCount,
        hasPrev: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Error fetching filtered salons:", err);
    res.status(500).json({ error: err.message });
  }
};


// Update key information for a salon
export const updateKeyInfo = async (req, res) => {
  const { salonId } = req.params;
  const { joined_on, stylist_career, good_image } = req.body;

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Check if key info record exists
    const existing = await db.query(
      'SELECT id FROM salon_key_info WHERE salon_id = $1 AND status = 1',
      [salonId]
    );

    if (existing.rows.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE salon_key_info
         SET joined_on = $1, stylist_career = $2, good_image = $3, updated_at = CURRENT_TIMESTAMP
         WHERE salon_id = $4 AND status = 1`,
        [joined_on, stylist_career, good_image, salonId]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO salon_key_info (salon_id, joined_on, stylist_career, good_image)
         VALUES ($1, $2, $3, $4)`,
        [salonId, joined_on, stylist_career, good_image]
      );
    }

    res.json({ message: 'Key information updated successfully' });
  } catch (err) {
    console.error("Error updating key information:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update languages for a salon
export const updateLanguages = async (req, res) => {
  const { salonId } = req.params;
  const { languages } = req.body; // Array of language strings

  try {
    // Verify salon ownership
    const ownershipCheck = await db.query(
      'SELECT s.id FROM salons s WHERE s.id = $1 AND s.user_id = $2 AND s.status = 1',
      [salonId, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized - You do not own this salon' });
    }

    // Soft delete existing languages
    await db.query(
      'UPDATE salon_languages SET status = 0, updated_at = CURRENT_TIMESTAMP WHERE salon_id = $1',
      [salonId]
    );

    // Insert new languages
    for (const language of languages) {
      await db.query(
        `INSERT INTO salon_languages (salon_id, language)
         VALUES ($1, $2)`,
        [salonId, language]
      );
    }

    res.json({ message: 'Languages updated successfully' });
  } catch (err) {
    console.error("Error updating languages:", err);
    res.status(500).json({ error: err.message });
  }
};
