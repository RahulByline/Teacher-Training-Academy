import pool from '../config/database.js';

// Helper: get all mappable fields from new schema
const getAllMappableFields = () => [
  // Contact fields
  { value: 'first_name', label: 'First Name', group: 'Contact' },
  { value: 'last_name', label: 'Last Name', group: 'Contact' },
  { value: 'title', label: 'Title', group: 'Contact' },
  { value: 'seniority', label: 'Seniority', group: 'Contact' },
  { value: 'stage', label: 'Stage', group: 'Contact' },
  { value: 'lists', label: 'Lists', group: 'Contact' },
  { value: 'last_contacted', label: 'Last Contacted', group: 'Contact' },
  { value: 'person_linkedin_url', label: 'Person Linkedin Url', group: 'Contact' },
  { value: 'contact_owner', label: 'Contact Owner (User ID)', group: 'Contact' },
  { value: 'contact_address', label: 'Personal Address', group: 'Contact' },
  { value: 'contact_city', label: 'Personal City', group: 'Contact' },
  { value: 'contact_state', label: 'Personal State', group: 'Contact' },
  { value: 'contact_country', label: 'Personal Country', group: 'Contact' },
  { value: 'contact_postal_code', label: 'Personal Postal Code', group: 'Contact' },
  // Company fields
  { value: 'company_name', label: 'Company Name', group: 'Company' },
  { value: 'company_website', label: 'Company Website', group: 'Company' },
  { value: 'company_linkedin_url', label: 'Company Linkedin Url', group: 'Company' },
  { value: 'company_facebook_url', label: 'Company Facebook Url', group: 'Company' },
  { value: 'company_twitter_url', label: 'Company Twitter Url', group: 'Company' },
  { value: 'company_industry', label: 'Company Industry', group: 'Company' },
  { value: 'company_num_employees', label: '# Employees', group: 'Company' },
  { value: 'company_annual_revenue', label: 'Annual Revenue', group: 'Company' },
  { value: 'company_total_funding', label: 'Total Funding', group: 'Company' },
  { value: 'company_latest_funding', label: 'Latest Funding', group: 'Company' },
  { value: 'company_latest_funding_amount', label: 'Latest Funding Amount', group: 'Company' },
  { value: 'company_last_raised_at', label: 'Last Raised At', group: 'Company' },
  { value: 'company_address', label: 'Company Address', group: 'Company' },
  { value: 'company_city', label: 'Company City', group: 'Company' },
  { value: 'company_state', label: 'Company State', group: 'Company' },
  { value: 'company_country', label: 'Company Country', group: 'Company' },
  { value: 'company_phone', label: 'Company Phone', group: 'Company' },
  { value: 'company_keywords', label: 'Company Keywords', group: 'Company' },
  // Email fields
  { value: 'email', label: 'Primary Email', group: 'Email' },
  { value: 'email_status', label: 'Email Status', group: 'Email' },
  { value: 'email_source', label: 'Primary Email Source', group: 'Email' },
  { value: 'email_confidence', label: 'Email Confidence', group: 'Email' },
  { value: 'email_catch_all_status', label: 'Primary Email Catch-all Status', group: 'Email' },
  { value: 'email_last_verified_at', label: 'Primary Email Last Verified At', group: 'Email' },
  { value: 'secondary_email', label: 'Secondary Email', group: 'Email' },
  { value: 'secondary_email_source', label: 'Secondary Email Source', group: 'Email' },
  { value: 'tertiary_email', label: 'Tertiary Email', group: 'Email' },
  { value: 'tertiary_email_source', label: 'Tertiary Email Source', group: 'Email' },
  { value: 'personal_email', label: 'Personal Email', group: 'Email' },
  // Phone fields
  { value: 'work_phone', label: 'Work Direct Phone', group: 'Phone' },
  { value: 'home_phone', label: 'Home Phone', group: 'Phone' },
  { value: 'mobile_phone', label: 'Mobile Phone', group: 'Phone' },
  { value: 'corporate_phone', label: 'Corporate Phone', group: 'Phone' },
  { value: 'other_phone', label: 'Other Phone', group: 'Phone' },
  // Department
  { value: 'department', label: 'Department', group: 'Department' },
  // Intent
  { value: 'primary_intent_topic', label: 'Primary Intent Topic', group: 'Intent' },
  { value: 'primary_intent_score', label: 'Primary Intent Score', group: 'Intent' },
  { value: 'secondary_intent_topic', label: 'Secondary Intent Topic', group: 'Intent' },
  { value: 'secondary_intent_score', label: 'Secondary Intent Score', group: 'Intent' },
  // Custom fields and others can be added as needed
];

export const getContactFields = async (req, res) => {
  try {
    res.json({ fields: getAllMappableFields() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact fields' });
  }
};

// Get all contacts
export const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];
    if (search) {
      whereClause += ` AND (
        first_name LIKE ? OR 
        last_name LIKE ? OR 
        title LIKE ? OR 
        person_linkedin_url LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM contacts ${whereClause}`,
      params
    );
    // Get contacts with company and department info
    const [contacts] = await pool.execute(
      `SELECT 
        c.*, 
        comp.id as company_id, comp.name as company_name, comp.website as company_website, comp.linkedin_url as company_linkedin_url, comp.facebook_url as company_facebook_url, comp.twitter_url as company_twitter_url, comp.industry as company_industry, comp.num_employees as company_num_employees, comp.annual_revenue as company_annual_revenue, comp.total_funding as company_total_funding, comp.latest_funding as company_latest_funding, comp.latest_funding_amount as company_latest_funding_amount, comp.last_raised_at as company_last_raised_at, comp.address as company_address, comp.city as company_city, comp.state as company_state, comp.country as company_country, comp.phone as company_phone, comp.seo_description as company_seo_description, comp.keywords as company_keywords, comp.subsidiary_of as company_subsidiary_of, d.name as department_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      LEFT JOIN departments d ON c.department_id = d.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`,
      params
    );
    // For each contact, fetch emails and phones
    const contactIds = contacts.map(c => c.id);
    let emails = [];
    let phones = [];
    if (contactIds.length > 0) {
      [emails] = await pool.execute(
        `SELECT * FROM emails WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
        contactIds
      );
      [phones] = await pool.execute(
        `SELECT * FROM phones WHERE contact_id IN (${contactIds.map(() => '?').join(',')})`,
        contactIds
      );
    }
    // Attach emails, phones, and company object to each contact
    const contactsWithDetails = contacts.map(contact => {
      return {
        ...contact,
        emails: emails.filter(e => e.contact_id === contact.id),
        phones: phones.filter(p => p.contact_id === contact.id),
        company: {
          id: contact.company_id,
          name: contact.company_name,
          website: contact.company_website,
          linkedin_url: contact.company_linkedin_url,
          facebook_url: contact.company_facebook_url,
          twitter_url: contact.company_twitter_url,
          industry: contact.company_industry,
          num_employees: contact.company_num_employees,
          annual_revenue: contact.company_annual_revenue,
          total_funding: contact.company_total_funding,
          latest_funding: contact.company_latest_funding,
          latest_funding_amount: contact.company_latest_funding_amount,
          last_raised_at: contact.company_last_raised_at,
          address: contact.company_address,
          city: contact.company_city,
          state: contact.company_state,
          country: contact.company_country,
          phone: contact.company_phone,
          seo_description: contact.company_seo_description,
          keywords: contact.company_keywords,
          subsidiary_of: contact.company_subsidiary_of
        },
        department: contact.department_name
      };
    });
    res.json({
      contacts: contactsWithDetails,
      pagination: {
        current_page: page,
        per_page: limit,
        total: countResult[0].total,
        total_pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

// Get single contact
export const getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const [contacts] = await pool.execute(
      `SELECT 
        c.*,
        comp.name as company_name_resolved,
        u.first_name as owner_first_name,
        u.last_name as owner_last_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      LEFT JOIN users u ON c.owner_id = u.id
      WHERE c.id = ?`,
      [id]
    );

    if (contacts.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = contacts[0];
    
    // Parse custom_fields JSON
    if (contact.custom_fields) {
      try {
        contact.custom_fields = JSON.parse(contact.custom_fields);
      } catch (e) {
        contact.custom_fields = {};
      }
    }

    res.json({ contact });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
};

// Create contact
export const createContact = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      title,
      seniority,
      department, // department name
      company_name, // company name
      owner_id,
      stage,
      lists,
      last_contacted,
      person_linkedin_url,
      contact_owner,
      address,
      city,
      state,
      country,
      postal_code,
      emails = [],
      phones = [],
      ...customFields
    } = req.body;

    // Look up or create company
    let company_id = null;
    if (company_name) {
      const [companies] = await pool.execute('SELECT id FROM companies WHERE name = ?', [company_name]);
      if (companies.length > 0) {
        company_id = companies[0].id;
      } else {
        const [result] = await pool.execute(
          'INSERT INTO companies (name) VALUES (?)',
          [company_name]
        );
        company_id = result.insertId;
      }
    }
    // Look up or create department
    let department_id = null;
    if (department) {
      const [departments] = await pool.execute('SELECT id FROM departments WHERE name = ?', [department]);
      if (departments.length > 0) {
        department_id = departments[0].id;
      } else {
        const [result] = await pool.execute(
          'INSERT INTO departments (name) VALUES (?)',
          [department]
        );
        department_id = result.insertId;
      }
    }
    const customFieldsJson = Object.keys(customFields).length > 0 ? JSON.stringify(customFields) : null;
    // Insert contact
    const [result] = await pool.execute(
      `INSERT INTO contacts (
        first_name, last_name, title, seniority, department_id, company_id, owner_id, stage, lists, last_contacted, person_linkedin_url, contact_owner, address, city, state, country, postal_code, custom_fields
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        first_name || null,
        last_name || null,
        title || null,
        seniority || null,
        department_id || null,
        company_id || null,
        owner_id || null,
        stage || null,
        lists || null,
        last_contacted || null,
        person_linkedin_url || null,
        contact_owner || null,
        address || null,
        city || null,
        state || null,
        country || null,
        postal_code || null,
        customFieldsJson
      ]
    );
    const contactId = result.insertId;
    // Insert emails
    for (const emailObj of emails) {
      await pool.execute(
        `INSERT INTO emails (contact_id, email, type, status, source, confidence, catch_all_status, last_verified_at, is_primary, unsubscribe)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [
          contactId,
          emailObj.email,
          emailObj.type || 'primary',
          emailObj.status || null,
          emailObj.source || null,
          emailObj.confidence || null,
          emailObj.catch_all_status || null,
          emailObj.last_verified_at || null,
          emailObj.is_primary || false,
          emailObj.unsubscribe || false
        ]
      );
    }
    // Insert phones
    for (const phoneObj of phones) {
      await pool.execute(
        `INSERT INTO phones (contact_id, phone, type)
         VALUES (?, ?, ?)` ,
        [
          contactId,
          phoneObj.phone,
          phoneObj.type || 'work'
        ]
      );
    }
    // Fetch created contact
    const [contacts] = await pool.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [contactId]
    );
    res.status(201).json({
      message: 'Contact created successfully',
      contact: contacts[0]
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

// Update contact
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_id,
      first_name,
      last_name,
      full_name,
      email,
      phone,
      mobile,
      job_title,
      department,
      company_name,
      company_phone,
      address,
      city,
      state,
      postal_code,
      country,
      lead_source,
      lead_status,
      notes,
      tags,
      ...customFields
    } = req.body;

    // Check if contact exists and user has permission
    const [existingContacts] = await pool.execute(
      'SELECT id, owner_id FROM contacts WHERE id = ?',
      [id]
    );

    if (existingContacts.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Check ownership (only allow update if user is owner or admin/manager)
    const contact = existingContacts[0];
    if (contact.owner_id !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. You can only edit your own contacts.' });
    }

    // Auto-generate full_name if not provided
    let finalFullName = full_name;
    if (!finalFullName && (first_name || last_name)) {
      finalFullName = [first_name, last_name].filter(Boolean).join(' ');
    }

    // Prepare custom_fields JSON
    const customFieldsJson = Object.keys(customFields).length > 0 
      ? JSON.stringify(customFields) 
      : null;

    await pool.execute(
      `UPDATE contacts SET 
        company_id = ?, first_name = ?, last_name = ?, full_name = ?, email = ?, 
        phone = ?, mobile = ?, job_title = ?, department = ?, company_name = ?, 
        company_phone = ?, address = ?, city = ?, state = ?, 
        postal_code = ?, country = ?, lead_source = ?, lead_status = ?, 
        notes = ?, tags = ?, custom_fields = ?
      WHERE id = ?`,
      [
        company_id || null,
        first_name || null,
        last_name || null,
        finalFullName || null,
        email || null,
        phone || null,
        mobile || null,
        job_title || null,
        department || null,
        company_name || null,
        company_phone || null,
        address || null,
        city || null,
        state || null,
        postal_code || null,
        country || null,
        lead_source || null,
        lead_status || null,
        notes || null,
        tags || null,
        customFieldsJson,
        id
      ]
    );

    // Fetch updated contact
    const [contacts] = await pool.execute(
      `SELECT 
        c.*,
        comp.name as company_name_resolved,
        u.first_name as owner_first_name,
        u.last_name as owner_last_name
      FROM contacts c
      LEFT JOIN companies comp ON c.company_id = comp.id
      LEFT JOIN users u ON c.owner_id = u.id
      WHERE c.id = ?`,
      [id]
    );

    const updatedContact = contacts[0];
    if (updatedContact.custom_fields) {
      try {
        updatedContact.custom_fields = JSON.parse(updatedContact.custom_fields);
      } catch (e) {
        updatedContact.custom_fields = {};
      }
    }

    res.json({
      message: 'Contact updated successfully',
      contact: updatedContact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact exists and user has permission
    const [existingContacts] = await pool.execute(
      'SELECT id, owner_id FROM contacts WHERE id = ?',
      [id]
    );

    if (existingContacts.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Check ownership
    const contact = existingContacts[0];
    if (contact.owner_id !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own contacts.' });
    }

    await pool.execute('DELETE FROM contacts WHERE id = ?', [id]);

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

// Bulk import contacts
export const importContacts = async (req, res) => {
  try {
    const { files, mappings } = req.body;
    if (!files || !Array.isArray(files) || !mappings || !Array.isArray(mappings)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    let totalImported = 0;
    const errors = [];
    const BATCH_SIZE = 500;
    const allRows = [];
    files.forEach((fileData, fileIndex) => {
      if (fileData && Array.isArray(fileData) && mappings[fileIndex]) {
        fileData.forEach(row => {
          allRows.push({ row, mapping: mappings[fileIndex], fileIndex });
        });
      }
    });
    for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
      const batch = allRows.slice(i, i + BATCH_SIZE);
      for (let j = 0; j < batch.length; j++) {
        const { row, mapping, fileIndex } = batch[j];
        try {
          const contactData = {};
          const customFields = {};
          const emails = [];
          const phones = [];
          let company_id = null;
          let department_id = null;
          let companyData = null;
          Object.entries(mapping).forEach(([fileColumn, crmField]) => {
            if (crmField && crmField !== '-- Ignore --' && row[fileColumn] !== undefined) {
              if (crmField.startsWith('custom_fields.')) {
                const customFieldName = crmField.replace('custom_fields.', '');
                customFields[customFieldName] = row[fileColumn];
              } else if (crmField === 'email' || crmField === 'secondary_email' || crmField === 'tertiary_email') {
                emails.push({ email: row[fileColumn], type: crmField === 'email' ? 'primary' : crmField.replace('_email', '') });
              } else if (crmField.endsWith('_phone')) {
                phones.push({ phone: row[fileColumn], type: crmField.replace('_phone', '') });
              } else if (crmField === 'company_name') {
                contactData.company_name = row[fileColumn];
              } else if (crmField === 'department') {
                contactData.department = row[fileColumn];
              } else if (crmField === 'personal_email') {
                emails.push({ email: row[fileColumn], type: 'personal' });
              } else if (crmField === 'contact_address') { contactData.address = row[fileColumn]; }
              else if (crmField === 'contact_city') { contactData.city = row[fileColumn]; }
              else if (crmField === 'contact_state') { contactData.state = row[fileColumn]; }
              else if (crmField === 'contact_country') { contactData.country = row[fileColumn]; }
              else if (crmField === 'contact_postal_code') { contactData.postal_code = row[fileColumn]; }
              else if (crmField.startsWith('company_')) { 
                if (!companyData) companyData = {};
                companyData[crmField.replace('company_', '')] = row[fileColumn];
              } else {
                contactData[crmField] = row[fileColumn];
              }
            }
          });
          // Look up or create company
          if (contactData.company_name) {
            const [companies] = await pool.execute('SELECT id FROM companies WHERE name = ?', [contactData.company_name]);
            if (companies.length > 0) {
              company_id = companies[0].id;
            } else {
              // Prepare company insert fields
              const fields = ['name'];
              const values = [contactData.company_name];
              if (companyData) {
                for (const [key, value] of Object.entries(companyData)) {
                  if (value !== undefined && value !== null) {
                    fields.push(key);
                    values.push(value);
                  }
                }
              }
              const placeholders = fields.map(() => '?').join(', ');
              const [result] = await pool.execute(
                `INSERT INTO companies (${fields.join(', ')}) VALUES (${placeholders})`,
                values
              );
              company_id = result.insertId;
            }
          }
          // Look up or create department
          if (contactData.department) {
            const [departments] = await pool.execute('SELECT id FROM departments WHERE name = ?', [contactData.department]);
            if (departments.length > 0) {
              department_id = departments[0].id;
            } else {
              const [result] = await pool.execute('INSERT INTO departments (name) VALUES (?)', [contactData.department]);
              department_id = result.insertId;
            }
          }
          contactData.custom_fields = Object.keys(customFields).length > 0 ? JSON.stringify(customFields) : null;
          // Insert contact
          const [result] = await pool.execute(
            `INSERT INTO contacts (
              first_name, last_name, title, seniority, department_id, company_id, owner_id, stage, lists, last_contacted, person_linkedin_url, contact_owner, address, city, state, country, postal_code, custom_fields
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
            [
              contactData.first_name || null,
              contactData.last_name || null,
              contactData.title || null,
              contactData.seniority || null,
              department_id || null,
              company_id || null,
              contactData.owner_id || null,
              contactData.stage || null,
              contactData.lists || null,
              contactData.last_contacted || null,
              contactData.person_linkedin_url || null,
              contactData.contact_owner || null,
              contactData.address || null,
              contactData.city || null,
              contactData.state || null,
              contactData.country || null,
              contactData.postal_code || null,
              contactData.custom_fields
            ]
          );
          const contactId = result.insertId;
          // Insert emails
          for (const emailObj of emails) {
            await pool.execute(
              `INSERT INTO emails (contact_id, email, type)
               VALUES (?, ?, ?)` ,
              [
                contactId,
                emailObj.email,
                emailObj.type || 'primary'
              ]
            );
          }
          // Insert phones
          for (const phoneObj of phones) {
            await pool.execute(
              `INSERT INTO phones (contact_id, phone, type)
               VALUES (?, ?, ?)` ,
              [
                contactId,
                phoneObj.phone,
                phoneObj.type || 'work'
              ]
            );
          }
          totalImported++;
        } catch (error) {
          errors.push(`File ${fileIndex + 1}, Row ${j + 1 + i}: ${error.message}`);
        }
      }
    }
    res.json({
      message: 'Import completed',
      total_imported: totalImported,
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    console.error('Import contacts error:', error);
    res.status(500).json({ error: 'Failed to import contacts' });
  }
};