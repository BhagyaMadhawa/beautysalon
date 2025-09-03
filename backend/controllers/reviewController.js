
import db from '../db.js';

// Get reviews for a salon
export const getReviews = async (req, res) => {
  try {
    const { salonId } = req.params;
    const { page = 1, limit = 10, rating, sortBy = 'newest' } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        json_agg(DISTINCT ri.image_url) FILTER (WHERE ri.id IS NOT NULL) as images,
        json_agg(DISTINCT jsonb_build_object(
          'category_id', cr.category_id,
          'rating', cr.rating,
          'category_name', rc.name
        )) FILTER (WHERE cr.id IS NOT NULL) as category_ratings
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN review_images ri ON r.id = ri.review_id
      LEFT JOIN category_ratings cr ON r.id = cr.review_id
      LEFT JOIN rating_categories rc ON cr.category_id = rc.id
      WHERE r.salon_id = $1 AND r.status = 1
    `;
    
    const params = [salonId];
    let paramIndex = 2;
    
    if (rating) {
      query += ` AND r.rating = $${paramIndex}`;
      params.push(rating);
      paramIndex++;
    }
    
    query += ` GROUP BY r.id, u.id`;
    
    // Sorting
    switch (sortBy) {
      case 'highest':
        query += ` ORDER BY r.rating DESC`;
        break;
      case 'lowest':
        query += ` ORDER BY r.rating ASC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY r.created_at DESC`;
        break;
    }
    
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const { rows: reviews } = await db.query(query, params);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) FROM reviews 
      WHERE salon_id = $1 AND status = 1
      ${rating ? 'AND rating = $2' : ''}
    `;
    
    const countParams = [salonId];
    if (rating) countParams.push(rating);
    
    const { rows: countRows } = await db.query(countQuery, countParams);
    const totalCount = parseInt(countRows[0].count);
    
    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { salonId } = req.params;
    const userId = req.user.id;
    const { rating, reviewText, categoryRatings = [], images = [] } = req.body;
    
    // Check if user already reviewed this salon
    const existingReview = await client.query(
      'SELECT id FROM reviews WHERE salon_id = $1 AND user_id = $2 AND status = 1',
      [salonId, userId]
    );
    
    if (existingReview.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You have already reviewed this salon' });
    }
    
    // Insert main review
    const reviewResult = await client.query(
      `INSERT INTO reviews (salon_id, user_id, rating, review_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [salonId, userId, rating, reviewText]
    );
    
    const review = reviewResult.rows[0];
    
    // Insert category ratings
    for (const categoryRating of categoryRatings) {
      await client.query(
        `INSERT INTO category_ratings (review_id, category_id, rating)
         VALUES ($1, $2, $3)`,
        [review.id, categoryRating.categoryId, categoryRating.rating]
      );
    }
    
    // Insert review images
    for (const imageUrl of images) {
      await client.query(
        `INSERT INTO review_images (review_id, image_url)
         VALUES ($1, $2)`,
        [review.id, imageUrl]
      );
    }
    
    // Update salon rating statistics
    await updateSalonRatings(client, salonId);
    
    await client.query('COMMIT');
    
    // Get the complete review with user info
    const completeReview = await client.query(`
      SELECT 
        r.*,
        u.first_name,
        u.last_name,
        u.profile_image_url,
        json_agg(DISTINCT ri.image_url) FILTER (WHERE ri.id IS NOT NULL) as images,
        json_agg(DISTINCT jsonb_build_object(
          'category_id', cr.category_id,
          'rating', cr.rating,
          'category_name', rc.name
        )) FILTER (WHERE cr.id IS NOT NULL) as category_ratings
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN review_images ri ON r.id = ri.review_id
      LEFT JOIN category_ratings cr ON r.id = cr.review_id
      LEFT JOIN rating_categories rc ON cr.category_id = rc.id
      WHERE r.id = $1
      GROUP BY r.id, u.id
    `, [review.id]);
    
    res.status(201).json({ review: completeReview.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  } finally {
    client.release();
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { rating, reviewText, categoryRatings = [], images = [] } = req.body;
    
    // Verify review ownership
    const reviewCheck = await client.query(
      'SELECT salon_id FROM reviews WHERE id = $1 AND user_id = $2 AND status = 1',
      [reviewId, userId]
    );
    
    if (reviewCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    const salonId = reviewCheck.rows[0].salon_id;
    
    // Update main review
    await client.query(
      `UPDATE reviews 
       SET rating = $1, review_text = $2, updated_at = NOW()
       WHERE id = $3`,
      [rating, reviewText, reviewId]
    );
    
    // Update category ratings (delete and reinsert)
    await client.query('DELETE FROM category_ratings WHERE review_id = $1', [reviewId]);
    for (const categoryRating of categoryRatings) {
      await client.query(
        `INSERT INTO category_ratings (review_id, category_id, rating)
         VALUES ($1, $2, $3)`,
        [reviewId, categoryRating.categoryId, categoryRating.rating]
      );
    }
    
    // Update images (delete and reinsert)
    await client.query('DELETE FROM review_images WHERE review_id = $1', [reviewId]);
    for (const imageUrl of images) {
      await client.query(
        `INSERT INTO review_images (review_id, image_url)
         VALUES ($1, $2)`,
        [reviewId, imageUrl]
      );
    }
    
    // Update salon rating statistics
    await updateSalonRatings(client, salonId);
    
    await client.query('COMMIT');
    
    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  } finally {
    client.release();
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    // Verify review ownership
    const reviewCheck = await client.query(
      'SELECT salon_id FROM reviews WHERE id = $1 AND user_id = $2 AND status = 1',
      [reviewId, userId]
    );
    
    if (reviewCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Review not found or access denied' });
    }
    
    const salonId = reviewCheck.rows[0].salon_id;
    
    // Soft delete the review
    await client.query(
      'UPDATE reviews SET status = 0, updated_at = NOW() WHERE id = $1',
      [reviewId]
    );
    
    // Update salon rating statistics
    await updateSalonRatings(client, salonId);
    
    await client.query('COMMIT');
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  } finally {
    client.release();
  }
};

// Get review statistics for a salon
export const getReviewStats = async (req, res) => {
  try {
    const { salonId } = req.params;
    
    // Get overall rating stats
    const ratingStats = await db.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(*) FILTER (WHERE rating = 5) as five_star,
        COUNT(*) FILTER (WHERE rating = 4) as four_star,
        COUNT(*) FILTER (WHERE rating = 3) as three_star,
        COUNT(*) FILTER (WHERE rating = 2) as two_star,
        COUNT(*) FILTER (WHERE rating = 1) as one_star
      FROM reviews 
      WHERE salon_id = $1 AND status = 1
    `, [salonId]);
    
    // Get category rating stats
    const categoryStats = await db.query(`
      SELECT 
        rc.id,
        rc.name,
        rc.description,
        AVG(cr.rating) as average_rating,
        COUNT(cr.id) as total_ratings
      FROM rating_categories rc
      LEFT JOIN category_ratings cr ON rc.id = cr.category_id
      LEFT JOIN reviews r ON cr.review_id = r.id
      WHERE r.salon_id = $1 AND r.status = 1
      GROUP BY rc.id, rc.name, rc.description
      ORDER BY rc.id
    `, [salonId]);
    
    res.json({
      overall: ratingStats.rows[0],
      categories: categoryStats.rows
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
};

// Get all rating categories
export const getReviewCategories = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT * FROM rating_categories 
      WHERE status = 1 
      ORDER BY id
    `);
    
    res.json({ categories: rows });
  } catch (error) {
    console.error('Error fetching rating categories:', error);
    res.status(500).json({ error: 'Failed to fetch rating categories' });
  }
};

// Helper function to update salon rating statistics
async function updateSalonRatings(client, salonId) {
  // Calculate new average rating and total reviews
  const stats = await client.query(`
    SELECT 
      AVG(rating) as average_rating,
      COUNT(*) as total_reviews
    FROM reviews 
    WHERE salon_id = $1 AND status = 1
  `, [salonId]);
  
  const { average_rating, total_reviews } = stats.rows[0];
  
  // Update salon table
  await client.query(`
    UPDATE salons 
    SET average_rating = $1, total_reviews = $2, updated_at = NOW()
    WHERE id = $3
  `, [average_rating || 0, total_reviews || 0, salonId]);
}
