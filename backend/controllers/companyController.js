import pool from '../config/database.js';

// Get all companies (for dropdowns)
export const getCompanies = async (req, res) => {
  try {
    const [companies] = await pool.execute(
      'SELECT id, name, industry, website, phone FROM companies ORDER BY name'
    );

    res.json({ companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// Get single company
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const [companies] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [id]
    );

    if (companies.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Parse custom_fields JSON
    const company = companies[0];
    if (company.custom_fields) {
      try {
        company.custom_fields = JSON.parse(company.custom_fields);
      } catch (e) {
        company.custom_fields = {};
      }
    }

    res.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

// Create company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      industry,
      website,
      phone,
      address,
      city,
      state,
      country,
      ...customFields
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Prepare custom_fields JSON
    const customFieldsJson = Object.keys(customFields).length > 0 
      ? JSON.stringify(customFields) 
      : null;

    const [result] = await pool.execute(
      `INSERT INTO companies (
        name, industry, website, phone, address, city, state, country, custom_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        name,
        industry || null,
        website || null,
        phone || null,
        address || null,
        city || null,
        state || null,
        country || null,
        customFieldsJson
      ]
    );

    // Fetch created company
    const [companies] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [result.insertId]
    );

    const company = companies[0];
    if (company.custom_fields) {
      try {
        company.custom_fields = JSON.parse(company.custom_fields);
      } catch (e) {
        company.custom_fields = {};
      }
    }

    res.status(201).json({
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      industry,
      website,
      phone,
      address,
      city,
      state,
      country,
      ...customFields
    } = req.body;

    // Check if company exists
    const [existingCompanies] = await pool.execute(
      'SELECT id FROM companies WHERE id = ?',
      [id]
    );

    if (existingCompanies.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Prepare custom_fields JSON
    const customFieldsJson = Object.keys(customFields).length > 0 
      ? JSON.stringify(customFields) 
      : null;

    await pool.execute(
      `UPDATE companies SET 
        name = ?,
        industry = ?,
        website = ?,
        phone = ?,
        address = ?,
        city = ?,
        state = ?,
        country = ?,
        custom_fields = ?
      WHERE id = ?`,
      [
        name,
        industry || null,
        website || null,
        phone || null,
        address || null,
        city || null,
        state || null,
        country || null,
        customFieldsJson,
        id
      ]
    );

    // Fetch updated company
    const [companies] = await pool.execute(
      'SELECT * FROM companies WHERE id = ?',
      [id]
    );

    const company = companies[0];
    if (company.custom_fields) {
      try {
        company.custom_fields = JSON.parse(company.custom_fields);
      } catch (e) {
        company.custom_fields = {};
      }
    }

    res.json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const [existingCompanies] = await pool.execute(
      'SELECT id FROM companies WHERE id = ?',
      [id]
    );

    if (existingCompanies.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if company has associated contacts
    const [contacts] = await pool.execute(
      'SELECT COUNT(*) as count FROM contacts WHERE company_id = ?',
      [id]
    );

    if (contacts[0].count > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete company with associated contacts. Please remove or reassign contacts first.' 
      });
    }

    await pool.execute('DELETE FROM companies WHERE id = ?', [id]);

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
};