import React, { useState } from 'react';
import { createSchool } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  shortname: '',
  country: '',
  city: '',
  address: '',
  description: '',
};

const AddSchoolPage: React.FC = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: any = {
        name: form.name,
        shortname: form.shortname,
        country: form.country,
        city: form.city,
        address: form.address,
      };
      // Only add description if not empty
      if (form.description) payload.custom1 = form.description;
      const result = await createSchool(payload);
      setSuccess('School created successfully!');
      setForm(initialState);
      // Optionally, redirect after a short delay
      setTimeout(() => navigate('/schools'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New School</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded shadow">
        <div>
          <label className="block font-medium mb-1">School Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Short Name *</label>
          <input
            type="text"
            name="shortname"
            value={form.shortname}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Country *</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. IN, SA, US"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create School'}
        </button>
      </form>
    </div>
  );
};

export default AddSchoolPage; 