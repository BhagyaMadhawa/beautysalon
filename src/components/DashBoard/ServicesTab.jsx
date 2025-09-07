import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Upload, Check, Trash2 } from "lucide-react";
import Alert from '../Alert';
import ConfirmationModal from '../ConfirmationModal';

const durations = ["30 min", "45 min", "60 min", "90 min"];

export default function ServicesTab({ userId, salonId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState({
    image: null,
    serviceName: "",
    duration: "30 min",
    price: "",
    discountedPrice: "",
    description: "",
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

  const navigate = useNavigate();

  // Fetch existing services on component mount
  useEffect(() => {
    fetchServices();
  }, [salonId]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (i, field, value) => {
    setServices((prev) =>
      prev.map((svc, idx) =>
        idx === i ? { ...svc, [field]: value } : svc
      )
    );
  };

  const handleImageChange = (i, file) => {
    setServices((prev) =>
      prev.map((svc, idx) =>
        idx === i ? { ...svc, image: file } : svc
      )
    );
  };

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewImageChange = (file) => {
    setNewService(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleAddService = () => {
    setShowAddForm(true);
  };

  const handleSaveNewService = async () => {
    if (!newService.serviceName || !newService.price) {
      setAlert({ type: 'warning', message: 'Please fill in service name and price' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', newService.serviceName);
      formData.append('duration', newService.duration);
      formData.append('price', newService.price);
      formData.append('discounted_price', newService.discountedPrice || null);
      formData.append('description', newService.description);

      if (newService.image) {
        formData.append('image', newService.image);
      }

      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setNewService({
          image: null,
          serviceName: "",
          duration: "30 min",
          price: "",
          discountedPrice: "",
          description: "",
        });
        setShowAddForm(false);
        setAlert({ type: 'success', message: 'Service added successfully.' });
        fetchServices(); // Refresh the list
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.error || 'Failed to add service' });
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setAlert({ type: 'error', message: 'Failed to add service' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateService = async (serviceId, updatedService) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedService.serviceName || updatedService.name,
          duration: updatedService.duration,
          price: updatedService.price,
          discounted_price: updatedService.discountedPrice || updatedService.discounted_price,
          description: updatedService.description
        })
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Service updated successfully.' });
        fetchServices(); // Refresh the list
      } else {
        const error = await response.json();
        setAlert({ type: 'error', message: error.error || 'Failed to update service' });
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setAlert({ type: 'error', message: 'Failed to update service' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service?',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services/${serviceId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            setAlert({ type: 'success', message: 'Service deleted successfully.' });
            fetchServices(); // Refresh the list
          } else {
            const error = await response.json();
            setAlert({ type: 'error', message: error.error || 'Failed to delete service' });
          }
        } catch (error) {
          console.error('Error deleting service:', error);
          setAlert({ type: 'error', message: 'Failed to delete service' });
        }
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, onCancel: null });
      },
      onCancel: () => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, onCancel: null }),
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      setAlert({ type: 'error', message: 'Salon ID missing. Please complete previous steps.' });
      return;
    }

    // Prepare form data for image upload
    const formData = new FormData();
    services.forEach((svc, idx) => {
      formData.append(`services[${idx}][serviceName]`, svc.serviceName);
      formData.append(`services[${idx}][duration]`, svc.duration);
      formData.append(`services[${idx}][price]`, svc.price);
      formData.append(`services[${idx}][discountedPrice]`, svc.discountedPrice);
      formData.append(`services[${idx}][description]`, svc.description);
      if (svc.image) {
        formData.append(`services[${idx}][image]`, svc.image);
      }
    });

    try {
      const response = await fetch(`https://beautysalon-qq6r.vercel.app/api/salons/${salonId}/services`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setAlert({ type: 'error', message: data.error || 'Failed to save services.' });
        return;
      }

      // On success, navigate to next step with salonId and userId
      navigate("/regsal5", { state: { salonId, userId } });
    } catch (err) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">
        List your services
      </h1>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Existing Services */}
      {loading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : (
        <form
          className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl space-y-8 mb-6"
          onSubmit={handleSubmit}
        >
          <span className="block text-xl font-medium mb-2 text-black">Your Services</span>
          {services.map((service, i) => (
            <div
              key={service.id || i}
              className="flex flex-col md:flex-row gap-4 bg-white rounded-lg"
            >
              {/* Upload Box */}
              <div className="md:w-1/3">
                <label className="block w-full h-full cursor-pointer">
                  <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:bg-puce/20 transition">
                    {service.image ? (
                      <img
                        src={URL.createObjectURL(service.image)}
                        alt="Service"
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                      />
                    ) : service.image_url ? (
                      <img
                        src={service.image_url}
                        alt="Service"
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                        <span className="font-semibold text-puce">Upload images</span>
                        <span className="text-xs text-gray-500 mb-2">
                          Drag &amp; Drop or click below to upload images
                        </span>
                      </>
                    )}
                    <span className="text-puce underline font-medium text-sm hover:text-puce1-600 transition">
                      Upload images
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e =>
                        handleImageChange(i, e.target.files[0])
                      }
                    />
                  </div>
                </label>
              </div>
              {/* Service Fields */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={service.serviceName || service.name || ""}
                      onChange={e =>
                        handleFieldChange(i, "serviceName", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                      placeholder="Service Name"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Duration
                    </label>
                    <select
                      value={service.duration}
                      onChange={e =>
                        handleFieldChange(i, "duration", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    >
                      {durations.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Price of service
                    </label>
                    <input
                      type="text"
                      value={service.price}
                      onChange={e =>
                        handleFieldChange(i, "price", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                      placeholder="USD 24.16"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Discounted price
                    </label>
                    <input
                      type="text"
                      value={service.discountedPrice}
                      onChange={e =>
                        handleFieldChange(i, "discountedPrice", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                      placeholder="USD 24.16"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Service description
                  </label>
                  <input
                    type="text"
                    value={service.description}
                    onChange={e =>
                      handleFieldChange(i, "description", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Enter Service description here..."
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Add another service button */}
          <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl flex justify-start mb-8">
            <button
              type="button"
              className="bg-puce/10 text-puce border border-puce rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce/20 transition"
              onClick={handleAddService}
            >
              + Add another
            </button>
          </div>
          {/* Footer Buttons */}
          <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              type="button"
              className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: saving ? 1 : 1.03 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      )}

      {/* Add New Service Form */}
      {showAddForm && (
        <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-4xl bg-white p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Service</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="md:w-1/3">
              <label className="block mb-1 font-medium text-gray-700">Upload Image</label>
              <label className="block w-full h-full cursor-pointer">
                <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-6 flex flex-col items-center justify-center text-center min-h-[180px] hover:bg-puce/20 transition">
                  {newService.image ? (
                    <img
                      src={URL.createObjectURL(newService.image)}
                      alt="New Service"
                      className="w-24 h-24 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                      <span className="font-semibold text-puce">Upload images</span>
                      <span className="text-xs text-gray-500 mb-2">
                        Drag &amp; Drop or click below to upload images
                      </span>
                    </>
                  )}
                  <span className="text-puce underline font-medium text-sm hover:text-puce1-600 transition">
                    Upload images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e =>
                      handleNewImageChange(e.target.files[0])
                    }
                  />
                </div>
              </label>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newService.serviceName}
                    onChange={e =>
                      handleNewServiceChange("serviceName", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="Service Name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Duration
                  </label>
                  <select
                    value={newService.duration}
                    onChange={e =>
                      handleNewServiceChange("duration", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  >
                    {durations.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Price of service
                  </label>
                  <input
                    type="text"
                    value={newService.price}
                    onChange={e =>
                      handleNewServiceChange("price", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="USD 24.16"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Discounted price
                  </label>
                  <input
                    type="text"
                    value={newService.discountedPrice}
                    onChange={e =>
                      handleNewServiceChange("discountedPrice", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                    placeholder="USD 24.16"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Service description
                </label>
                <input
                  type="text"
                  value={newService.description}
                  onChange={e =>
                    handleNewServiceChange("description", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition"
                  placeholder="Enter Service description here..."
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-puce text-white px-4 py-2 rounded-lg font-medium hover:bg-puce/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveNewService}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Service'}
            </button>
          </div>
        </div>
      )}

      {confirmModal.isOpen && <ConfirmationModal {...confirmModal} />}
    </motion.div>
  );
}
