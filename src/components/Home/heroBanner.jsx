import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const BeautyExpertBanner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const popularServices = ['Hair stylist', 'Lashes', 'Semi-Permanent'];

  return (
    <div className="w-full max-w-[95%] h-[83vh] max-h-[75%] mx-auto px-6 pt-8 pb-4 rounded-2xl overflow-hidden shadow-md bg-white flex flex-col md:flex-row md:p-12 border-2 border-gray-300">

      {/* Left content - Search and text */}
      <motion.div 
        className="flex flex-col justify-center w-3/5 md:w-full pr-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-gray-950 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find Your Perfect<br />Beauty Expert
        </motion.h1>
        
        <motion.p 
          className="text-gray-700 mb-2 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover top-rated salons and beauty professionals near you.
        </motion.p>
        
        <motion.p 
          className="text-gray-700 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Browse their portfolio, read reviews, and book with ease.
        </motion.p>
        
        {/* Search Bar */}
        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder='Try "hair stylist" or "semi permanent make up"'
            className="w-[70%]  pl-12 pr-4 py-4 border-2  border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
        
        {/* Popular Services */}
        <div>
          <motion.p 
            className="text-gray-700 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Popular Services:
          </motion.p>
          
          <div className="flex flex-wrap gap-3">
            {popularServices.map((service, index) => (
              <motion.button
                key={service}
                className="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {service}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Right content - Image (hidden on mobile) */}
<motion.div
  className="hidden md:flex flex-col justify-center w-2/5 md:w-full pr-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 2 }}
  transition={{ duration: 0.8 }}
>
<div className="relative z-0 mx-auto w-full max-w-[500px] aspect-square">

    {/* Main image with proper spacing for rotation */}
    <motion.div
      className="rounded-2xl relative w-full h-full z-30 p-5"
      initial={{ scale: 1.05 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full h-full overflow-visible z-[30]">
        {/* Background Shadow Layer - uncommented and positioned properly */}
        <div className="absolute inset-0 rounded-3xl transform rotate-0 scale-1 z-0 shadow-xl bg-pale-dogwood" />

        {/* Image Container with overflow visible to prevent cutoff during rotation */}
        <div className="relative w-full h-full overflow-visible">
          <img
            src="https://img.freepik.com/free-photo/blond-female-pink-dress-with-golden-butterfly-isolated-grey-background_613910-10762.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid&w=740"
            alt="Beauty model with gold accents"
            className="w-full h-full object-cover rounded-3xl relative z-20 transform rotate-[6deg]"
          />
        </div>
      </div>
    </motion.div>

    {/* Decorative circles (hidden on mobile) */}
    <motion.div
      className="absolute top-[6%] left-[-3.5%] w-[106%] h-[60%] rounded-full border-2 border-primary opacity-60 z-[0] border-puce"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    />
    <motion.div
      className="absolute top-[36%] left-[-3.5%] w-[106%] h-[60%] rounded-full border-2 border-primary opacity-60 z-[0] border-puce"
      initial={{ scale: 0, rotate: 0 }}
      animate={{ scale: 1, rotate: 6 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    />
  </div>
</motion.div>
    </div>
  );
};

export default BeautyExpertBanner;