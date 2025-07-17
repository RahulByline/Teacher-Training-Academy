import express from 'express';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Test database connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Database connection successful');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

  app.use(cors({
    origin: '*', // or your frontend URL
    credentials: true
  }));

app.get('/api/company-context/:companyid', async (req, res) => {
  const companyid = req.params.companyid;
  try {
    // Step 1: Get the category id for the company
    const [companyRows] = await pool.query(
      'SELECT category FROM mdl_company WHERE id = ?',
      [companyid]
    );
    if (companyRows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const categoryid = companyRows[0].category;

    // Step 2: Get the context id for the category
    const [contextRows] = await pool.query(
      'SELECT id FROM mdl_context WHERE contextlevel = 30 AND instanceid = ?',
      [categoryid]
    );
    if (contextRows.length === 0) {
      return res.status(404).json({ error: 'Context not found for category' });
    }
    res.json({ contextid: contextRows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 