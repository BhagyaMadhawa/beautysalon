const uploadServiceImage = async (file) => {
  const formData = new FormData();
  formData.append('profile_image', file); // Using the same field name as the backend route

  const response = await fetch('https://beautysalon-qq6r.vercel.app/api/salons/upload/profile-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  const data = await response.json();
  return data.imageUrl;
};

export default uploadServiceImage;
