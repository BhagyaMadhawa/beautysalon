import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, MessageSquare, Heart } from 'lucide-react'

const HeroSection = () => {
  const [favorite, setFavorite] = useState(false)
  
  // Sample data for the salon
  const salonData = {
    name: "SOONSIKI Hair Hongdae | Romantique Branch",
    location: "Shibuya Tokyo, Japan",
    rating: 5,
    reviewCount: 899,
    images: [
      { id: 1, url: "https://www.freepik.com/free-photo/interior-latino-hair-salon_49639523.htm#fromView=search&page=1&position=0&uuid=3a6200d1-7f00-414e-8aaa-234f9ddf4db6&query=saloon+interior", alt: "Salon main interior" },
      { id: 2, url: "https://www.freepik.com/free-photo/modern-beauty-salon-interior_13349025.htm#fromView=search&page=1&position=1&uuid=3a6200d1-7f00-414e-8aaa-234f9ddf4db6&query=saloon+interior", alt: "Salon reception" },
      { id: 3, url: "https://img.freepik.com/free-photo/hairdresser-taking-care-her-client_23-2149319799.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid&w=740", alt: "Styling station" },
      { id: 4, url: "https://img.freepik.com/free-photo/close-up-details-hairdresser-salon_23-2149205854.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid&w=740", alt: "Washing area" },
      { id: 5, url: "https://img.freepik.com/premium-photo/beauty-salon-template-design_1120772-16177.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid&w=740", alt: "Product display", overlay: "14+" }
    ]
  }

  // Animation variants
  const imageHoverVariants = {
    initial: { scale: 1, zIndex: 0 },
  hover: { scale: 1.05, zIndex: 10, transition: { duration: 0.3 } }
  }

  // Toggle favorite handler
  const handleToggleFavorite = () => {
    setFavorite(!favorite)
  }

  return (
    <div className="max-w-full mx-auto px-10 pt-4 pb-8 ">
      {/* Image Gallery Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6 h-[60vh]">
        {/* Main large image */}
        <motion.div 
          className="col-span-3 md:col-span-2 rounded-lg overflow-hidden bg-gray-100 h-[60vh] relative"
          variants={imageHoverVariants}
          initial="initial"
          whileHover="hover"
        >
          <img 
            src={salonData.images[0].url} 
            alt={salonData.images[0].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right column images */}
        <div className="hidden md:grid col-span-1 grid-rows-2 gap-4 h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {salonData.images.slice(1, 3).map((image) => (
              <motion.div 
                key={image.id}
                className="rounded-lg overflow-hidden bg-gray-100 "
                variants={imageHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {salonData.images.slice(3, 5).map((image) => (
              <motion.div 
                key={image.id}
                className="rounded-lg overflow-hidden bg-gray-100  relative"
                variants={imageHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <img 
                  src={image.url} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {image.overlay && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-3xl font-medium">
                    {image.overlay}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Salon Information */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          {/* Location */}
          <div className="flex items-center mb-2 text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span>{salonData.location}</span>
          </div>
          
          {/* Salon Name */}
          <h1 className="Dark:text-white text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {salonData.name}
          </h1>
          
          {/* Ratings */}
          <div className="flex items-center">
            {Array(5).fill(null).map((_, index) => (
              <Star key={index} size={18} className="text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-700 font-medium">{salonData.reviewCount} Reviews</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full md:w-auto space-y-2">
          <button className="bg-black text-white rounded-md py-3 px-6 flex items-center justify-center font-medium hover:bg-gray-800 transition-colors">
            <MessageSquare size={18} className="mr-2" />
            Send Message
          </button>
          
          <button 
            onClick={handleToggleFavorite}
            className={`border rounded-md py-3 px-6 flex items-center justify-center font-medium transition-colors ${
              favorite 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart size={18} className={`mr-2 ${favorite ? 'fill-current' : ''}`} />
            {favorite ? 'Added to favorite' : 'Add to favorite'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection