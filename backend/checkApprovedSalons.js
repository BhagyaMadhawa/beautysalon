import db from './db.js';

const checkApprovedSalons = async () => {
  try {
    const { rows } = await db.query(`SELECT * FROM salons WHERE is_approved = TRUE AND status = 1;`);
    console.log("Approved Salons:", rows);
  } catch (err) {
    console.error("Error fetching approved salons:", err);
  } finally {
    process.exit();
  }
};

checkApprovedSalons();
