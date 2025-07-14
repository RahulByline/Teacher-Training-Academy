import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MOODLE_URL = 'https://<your-moodle-site>/webservice/rest/server.php'; // Replace with your URL
const TOKEN = 'YOUR_TOKEN_HERE'; // Replace with your token

const fetchCompanies = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('wstoken', TOKEN);
    formData.append('wsfunction', 'block_iomad_company_admin_get_companies');
    formData.append('moodlewsrestformat', 'json');
    formData.append('criteria[0][key]', '');
    formData.append('criteria[0][value]', '');

    const response = await axios.post(MOODLE_URL, formData);

    if (response.data && Array.isArray(response.data.companies)) {
      return response.data.companies;
    } else if (response.data && response.data.exception) {
      throw new Error(
        `Moodle API Error: ${response.data.errorcode} - ${response.data.message}`
      );
    } else {
      throw new Error('Invalid or empty response from Moodle API');
    }
  } catch (error) {
    throw error;
  }
};

const CompaniesDropdown = () => {
  const [companies, setCompanies] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCompanies()
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch companies');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!companies.length) return <div>No companies found.</div>;

  return (
    <div>
      <label htmlFor="company-select">Select a School/Company:</label>
      <select id="company-select">
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name} (ID: {company.id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompaniesDropdown; 