import db from "../db.js";

// Get Random Beauty Professionals for Home Page
export const getRandomBeautyProfessionals = async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  try {
    const { rows } = await db.query(`
      SELECT
        s.id,
        s.name,
        s.description,
        s.profile_image_url,
        u.first_name,
        u.last_name,
        sa.country,
        sa.city,
        sa.full_address,
        COUNT(r.id) as total_reviews,
        COALESCE(AVG(r.rating), 0) as average_rating,
        (
          SELECT STRING_AGG(sl.language, ', ')
          FROM salon_languages sl
          WHERE sl.salon_id = s.id AND sl.status = 1
        ) as languages,
        (
          SELECT ski.stylist_career
          FROM salon_key_info ski
          WHERE ski.salon_id = s.id AND ski.status = 1
          LIMIT 1
        ) as experience
      FROM salons s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN salon_addresses sa ON s.id = sa.salon_id AND sa.status = 1
      LEFT JOIN reviews r ON s.id = r.salon_id AND r.status = 1
      WHERE s.type = 'beauty_professional'
        AND s.status = 1
        AND s.is_approved = TRUE
      GROUP BY s.id, u.first_name, u.last_name, sa.country, sa.city, sa.full_address
      ORDER BY RANDOM()
      LIMIT $1
    `, [limit]);

    // Format the response for beauty experts component
    const experts = rows.map(expert => ({
      id: expert.id,
      name: expert.name,
      experience: expert.experience || `${Math.floor(Math.random() * 10) + 1} Years Experience`,
      languages: expert.languages ? expert.languages.split(', ') : ['English'],
      description: expert.description || 'Professional beauty services with expertise and care.',
      image: expert.profile_image_url || "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=face",
      location: expert.full_address ? `${expert.city}, ${expert.country}` : 'Location not specified',
      rating: parseFloat(expert.average_rating) || 0,
      reviews: parseInt(expert.total_reviews) || 0
    }));

    res.json({ experts });
  } catch (err) {
    console.error("Error fetching random beauty professionals:", err);
    res.status(500).json({ error: err.message });
  }
};

export default {
  getRandomBeautyProfessionals
};
