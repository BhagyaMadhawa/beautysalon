import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFullImageUrl } from '../../lib/imageUtils';
import Alert from '../Alert';
import ConfirmationModal from '../ConfirmationModal';

const initialAlbums = [
  {
    name: "",
    images: [],
  },
];

export default function ManagePortfolioTab({ userId, salonId }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (salonId) {
      fetchPortfolios();
    }
  }, [salonId]);

  const fetchPortfolios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/salons/${salonId}/portfolios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.portfolios && data.portfolios.length > 0) {
          const formattedAlbums = data.portfolios.map(portfolio => ({
            id: portfolio.portfolio_id,
            name: portfolio.album_name,
            images: portfolio.images ? portfolio.images.map(img => ({ id: img.id, url: getFullImageUrl(img.image_url) })) : []
          }));
          setAlbums(formattedAlbums);
        } else {
          setAlbums([]);
        }
      } else {
        setAlert({ type: 'error', message: 'Failed to fetch portfolios.' });
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setAlert({ type: 'error', message: 'Failed to fetch portfolios.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumNameChange = (index, value) => {
    setAlbums(prev =>
      prev.map((album, idx) =>
        idx === index ? { ...album, name: value } : album
      )
    );
  };

  const handleAddAlbum = () => {
    setAlbums(prev => [...prev, { name: "", images: [] }]);
  };

  const handleDeletePortfolio = (portfolioId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Album',
      message: 'Are you sure you want to delete this album?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/salons/${salonId}/portfolios/${portfolioId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setAlert({ type: 'success', message: 'Album deleted successfully.' });
            fetchPortfolios();
          } else {
            const error = await response.json();
            setAlert({ type: 'error', message: error.error || 'Failed to delete album' });
          }
        } catch (error) {
          console.error('Error deleting album:', error);
          setAlert({ type: 'error', message: 'Failed to delete album' });
        }
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
    });
  };

  const handleDeleteImage = (imageId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Image',
      message: 'Are you sure you want to delete this image?',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`/api/salons/${salonId}/portfolios/images/${imageId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setAlert({ type: 'success', message: 'Image deleted successfully.' });
            fetchPortfolios();
          } else {
            const error = await response.json();
            setAlert({ type: 'error', message: error.error || 'Failed to delete image' });
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          setAlert({ type: 'error', message: 'Failed to delete image' });
        }
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
    });
  };

  const handleUploadImages = async (index, files) => {
    const fileArray = Array.from(files);
    const uploadedImageUrls = [];
    const album = albums[index];

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/salons/upload/profile-image`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (!response.ok) {
          setAlert({ type: 'error', message: "Failed to upload one or more images." });
          continue;
        }

        const data = await response.json();
        uploadedImageUrls.push({ id: null, url: data.imageUrl });
      } catch (err) {
        setAlert({ type: 'error', message: "An error occurred during image upload." });
      }
    }

    if (album.id) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/salons/${salonId}/portfolios/${album.id}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ images: uploadedImageUrls })
        });
        if (response.ok) {
          setAlert({ type: 'success', message: 'Images added successfully.' });
          fetchPortfolios();
        } else {
          const error = await response.json();
          setAlert({ type: 'error', message: error.error || 'Failed to add images to album' });
        }
      } catch (error) {
        console.error('Error adding images to existing album:', error);
        setAlert({ type: 'error', message: 'Failed to add images to album' });
      }
    } else {
      setAlbums(prev => {
        const newAlbums = [...prev];
        newAlbums[index].images = [...newAlbums[index].images, ...uploadedImageUrls];
        return newAlbums;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salonId) {
      setAlert({ type: 'warning', message: "Salon ID missing. Please complete previous steps." });
      return;
    }

    const filteredAlbums = albums.filter(album => album.name.trim() !== "" || (album.images && album.images.length > 0));

    if (filteredAlbums.length === 0) {
      setAlert({ type: 'warning', message: "Please add at least one album with a name or images." });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');

      const newAlbums = filteredAlbums.filter(album => !album.id);
      const existingAlbums = filteredAlbums.filter(album => album.id);

      if (newAlbums.length > 0) {
        const response = await fetch(`/api/salons/${salonId}/portfolios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ albums: newAlbums }),
        });

        if (!response.ok) {
          const data = await response.json();
          setAlert({ type: 'error', message: data.error || "Failed to save new albums." });
          setSaving(false);
          return;
        }
      }

      for (const album of existingAlbums) {
        await fetch(`/api/salons/${salonId}/portfolios/${album.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ album_name: album.name })
        });
      }

      setAlert({ type: 'success', message: "Portfolio saved successfully!" });
      fetchPortfolios();
    } catch (err) {
      setAlert({ type: 'error', message: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center py-16">
        <div className="text-lg">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />
      <motion.div
        className="w-full min-h-screen bg-white flex flex-col items-center px-2 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {alert && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-8">
          Manage Portfolio
        </h1>

        <form
          className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-[70%] space-y-8 mb-6"
          onSubmit={handleSubmit}
        >
          {albums.map((album, i) => (
            <div key={album.id || i} className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex-1">
                  Album Name
                </label>
                {album.id && (
                  <button
                    type="button"
                    onClick={() => handleDeletePortfolio(album.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    aria-label="Remove album"
                  >
                    Remove Album
                  </button>
                )}
              </div>
              <input
                type="text"
                value={album.name}
                onChange={e => handleAlbumNameChange(i, e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-puce transition mb-4"
                placeholder="Album name"
              />
              <div className="border-2 border-dashed border-puce rounded-xl bg-puce/10 p-4 sm:p-6 flex flex-col items-center justify-center text-center mb-4 transition hover:bg-puce/20">
                <Upload className="w-8 h-8 mx-auto text-puce mb-2" />
                <span className="font-semibold text-puce">Upload images</span>
                <span className="text-xs text-gray-500 mb-2">
                  Drag &amp; Drop or click below to upload images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id={`upload-input-${i}`}
                  onChange={e => handleUploadImages(i, e.target.files)}
                />
                <label
                  htmlFor={`upload-input-${i}`}
                  className="text-puce underline font-medium text-sm cursor-pointer hover:text-puce1-600 transition"
                >
                  Upload images
                </label>
              </div>
              {album.images.length > 0 && (
                <div className="flex flex-wrap gap-3 py-2">
                  {album.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-white"
                    >
                      <img
                        src={img.url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700 shadow"
                        aria-label="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex justify-start mb-8">
            <button
              type="button"
              className="bg-puce/10 text-puce border border-puce rounded-lg px-4 py-2 font-medium text-sm hover:bg-puce/20 transition"
              onClick={handleAddAlbum}
            >
              + Add another album
            </button>
          </div>
          <div className="w-full max-w-[98vw] sm:max-w-[90vw] md:max-w-3xl flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              type="button"
              className="w-full sm:w-32 border border-gray-300 text-gray-700 bg-white rounded-lg py-2 font-medium hover:bg-gray-50 transition"
              onClick={() => navigate("/regsal2")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-32 bg-puce text-white rounded-lg py-2 font-medium hover:bg-puce1-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
