import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const SalonInfoEditor = ({ userId, salonId }) => {
  const [keyInfo, setKeyInfo] = useState({
    joined_on: '',
    stylist_career: '',
    good_image: ''
  });
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [salonId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [keyInfoResponse, languagesResponse] = await Promise.all([
        api(`/api/salons/${salonId}/key-info`),
        api(`/api/salons/${salonId}/languages`)
      ]);

      if (keyInfoResponse.keyInfo) {
        setKeyInfo(keyInfoResponse.keyInfo);
      }
      if (languagesResponse.languages) {
        setLanguages(languagesResponse.languages.map(lang => lang.language));
      }
    } catch (error) {
      console.error('Error fetching salon info:', error);
      setMessage('Error loading salon information');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyInfoChange = (field, value) => {
    setKeyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (index, value) => {
    const newLanguages = [...languages];
    newLanguages[index] = value;
    setLanguages(newLanguages);
  };

  const addLanguage = () => {
    setLanguages([...languages, '']);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      // Save key info
      await api(`/api/salons/${salonId}/key-info`, {
        method: 'PUT',
        body: JSON.stringify(keyInfo)
      });

      // Save languages
      await api(`/api/salons/${salonId}/languages`, {
        method: 'PUT',
        body: JSON.stringify({ languages })
      });

      setMessage('Salon information updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving salon info:', error);
      setMessage('Error saving salon information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="text-center">Loading salon information...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Salon Information</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Key Information */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Key Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joined On</label>
            <input
              type="text"
              value={keyInfo.joined_on}
              onChange={(e) => handleKeyInfoChange('joined_on', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., May 2006"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stylist Career</label>
            <input
              type="text"
              value={keyInfo.stylist_career}
              onChange={(e) => handleKeyInfoChange('stylist_career', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 5 years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Good Image</label>
            <input
              type="text"
              value={keyInfo.good_image}
              onChange={(e) => handleKeyInfoChange('good_image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Popular and loved"
            />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-3">Languages Spoken</h3>
        <div className="space-y-2">
          {languages.map((language, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={language}
                onChange={(e) => handleLanguageChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter language"
              />
              <button
                onClick={() => removeLanguage(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addLanguage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Language
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SalonInfoEditor;
