import db from '../db.js';

// Get all users with optional filtering
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.requesting_role,
        u.approval_status,
        u.created_at,
        u.profile_image_url,
        u.registration_step,
        ua.country,
        ua.city,
        ua.postcode,
        ua.full_address
      FROM users u
      LEFT JOIN user_addresses ua ON u.id = ua.user_id
      WHERE u.role != 'admin'
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (role && role !== 'all') {
      query += ` AND u.requesting_role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    if (status && status !== 'all') {
      query += ` AND u.approval_status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` ORDER BY u.created_at DESC`;
    
    const { rows } = await db.query(query, params);
    
    res.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get specific user details
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user details
    const userQuery = `
      SELECT 
        u.*,
        ua.country,
        ua.city,
        ua.postcode,
        ua.full_address
      FROM users u
      LEFT JOIN user_addresses ua ON u.id = ua.user_id
      WHERE u.id = $1
    `;
    
    const { rows: userRows } = await db.query(userQuery, [id]);
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userRows[0];
    
    // Get salon details if applicable
    let salon = null;
    if (user.requesting_role === 'professional' || user.requesting_role === 'owner') {
      const salonQuery = `
        SELECT 
          s.*,
          sa.country as salon_country,
          sa.city as salon_city,
          sa.postcode as salon_postcode,
          sa.full_address as salon_address
        FROM salons s
        LEFT JOIN salon_addresses sa ON s.id = sa.salon_id
        WHERE s.user_id = $1 AND s.status = 1
      `;
      
      const { rows: salonRows } = await db.query(salonQuery, [id]);
      salon = salonRows[0] || null;
      
      if (salon) {
        // Get additional salon data
        const [services, portfolios, team, gallery, faqs] = await Promise.all([
          db.query('SELECT * FROM services WHERE salon_id = $1 AND status = 1', [salon.id]),
          db.query('SELECT * FROM portfolios WHERE salon_id = $1 AND status = 1', [salon.id]),
          db.query('SELECT * FROM team_members WHERE salon_id = $1', [salon.id]),
          db.query('SELECT * FROM salon_gallery WHERE salon_id = $1', [salon.id]),
          db.query('SELECT * FROM faqs WHERE salon_id = $1 AND status = 1', [salon.id])
        ]);
        
        salon = {
          ...salon,
          services: services.rows,
          portfolios: portfolios.rows,
          team: team.rows,
          gallery: gallery.rows,
          faqs: faqs.rows
        };
      }
    }
    
    res.json({ user, salon });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const { rows } = await db.query(
      'UPDATE users SET approval_status = $1, role = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      ['approved', role || 'client', id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If approving a salon owner or professional, also approve their salon
    if (role === 'owner' || role === 'professional') {
      await db.query(
        'UPDATE salons SET is_approved = true, updated_at = NOW() WHERE user_id = $1',
        [id]
      );
    }
    
    res.json({ message: 'User approved successfully', user: rows[0] });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { rows } = await db.query(
      'UPDATE users SET approval_status = $1, approval_message = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      ['rejected', reason || null, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User rejected successfully', user: rows[0] });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const client = await db.connect();
  try {
    // Check if user exists
    const { rows: userRows } = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (userRows.length === 0) {
      client.release();
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];

    await client.query('BEGIN');

    // Soft delete the user
    await client.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
      [2, id] // 2 = deleted
    );

    // If user owns or is professional, disable their salon
    if (['owner', 'professional'].includes(user.requesting_role)) {
      await client.query(
        'UPDATE salons SET status = $1, updated_at = NOW() WHERE user_id = $2',
        [0, id] // 0 = inactive
      );
    }

    // Mark user favorites inactive
    await client.query(
      'UPDATE user_favorites SET status = $1, updated_at = NOW() WHERE user_id = $2',
      [0, id]
    );

    // Mark reviews as deleted
    await client.query(
      'UPDATE reviews SET status = $1, updated_at = NOW() WHERE user_id = $2',
      [0, id]
    );

    await client.query('COMMIT');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  } finally {
    client.release();
  }
};

