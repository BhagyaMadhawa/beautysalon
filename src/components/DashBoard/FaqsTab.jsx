import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Menu, Trash2, Edit2, Save, X } from "lucide-react";
import Alert from '../Alert';
import ConfirmationModal from '../ConfirmationModal';

export default function FaqsTab({ userId, salonId }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  // Fetch FAQs on component mount
  useEffect(() => {
    fetchFaqs();
  }, [salonId]);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/faqs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      setAlert({ type: 'warning', message: 'Please fill in both question and answer' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify([newFaq])
      });

      if (response.ok) {
        setNewFaq({ question: "", answer: "" });
        setShowAddForm(false);
        setAlert({ type: 'success', message: 'FAQ added successfully.' });
        fetchFaqs(); // Refresh the list
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.error || 'Failed to add FAQ' });
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      setAlert({ type: 'error', message: 'Failed to add FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFaq = async (faqId, updatedFaq) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/faqs/${faqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedFaq)
      });

      if (response.ok) {
        setEditingId(null);
        fetchFaqs(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update FAQ');
      }
    } catch (error) {
      console.error('Error updating FAQ:', error);
      alert('Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/faqs/${faqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchFaqs(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center py-16">
        <div className="text-lg">Loading FAQs...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">
        Manage FAQs
      </h1>

      {/* Add New FAQ Button */}
      <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-puce text-white px-4 py-2 rounded-lg hover:bg-puce/90 transition"
        >
          {showAddForm ? 'Cancel' : '+ Add New FAQ'}
        </button>
      </div>

      {/* Add FAQ Form */}
      {showAddForm && (
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New FAQ</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter your question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="4"
                placeholder="Enter your answer"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddFaq}
              disabled={saving}
              className="bg-puce text-white px-4 py-2 rounded-lg hover:bg-puce/90 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add FAQ'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Existing FAQs */}
      <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl space-y-4">
        <h3 className="text-xl font-semibold">Your FAQs</h3>
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No FAQs added yet. Click "Add New FAQ" to get started.
          </div>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {editingId === faq.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = {...faq, question: e.target.value};
                        setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f));
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = {...faq, answer: e.target.value};
                        setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f));
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="4"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateFaq(faq.id, faq)}
                      disabled={saving}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingId(faq.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(faq.created_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}