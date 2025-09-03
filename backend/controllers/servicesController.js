import db from '../db.js';

export const getServiceCategories = async (_req, res) => {
  try {
    // Distinct service names from services table
    const { rows } = await db.query(
      `SELECT DISTINCT name
       FROM services
       WHERE status = 1
       ORDER BY name ASC`
    );
    const categories = rows.map(r => r.name).filter(Boolean);
    res.json({ categories });
  } catch (err) {
    console.error('Error fetching service categories:', err);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
};
