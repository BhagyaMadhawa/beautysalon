import { motion } from 'framer-motion';
import find_bg from '../../assets/findNbg.png';

const BeautyCTASection = () => {
  return (
    <div className="w-full rounded-3xl mx-auto px-2 sm:px-2 py-2 sm:py-8 min-h-[350px] sm:min-h-[420px] flex flex-col justify-center items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[90%] min-h-[320px] sm:min-h-[380px] flex items-center justify-center rounded-3xl"
        style={{
          backgroundImage: `url(${find_bg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {/* Left Card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:block absolute left-[8%] top-1/4 -translate-y-1/2 z-10"
        >
          <div className="w-38 h-46 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg -rotate-12 bg-white border-4 border-[#e3d0d0]">
            <img
              src="https://img.freepik.com/free-photo/beautiful-young-woman-with-clean-fresh-skin_186202-4956.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid"
              alt="Beauty professional"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-20 flex flex-col items-center justify-center w-full px-2 sm:px-0"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 text-center leading-tight">
            Find &amp; Book Your<br />
            Beauty <span className="text-transparent bg-clip-text bg-gradient-to-r from-puce to-puce1-500">Expert</span> Now
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-xl text-center">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat occaecat cupidatat proident pariatur.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-puce hover:bg-puce1-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-md transition-all duration-300 min-w-[200px]"
            >
              Search for Services
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold text-base hover:border-gray-400 shadow transition-all duration-300 min-w-[200px]"
            >
              Join as a Beauty Professional
            </motion.button>
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden md:block absolute right-[8%] top-1/4 -translate-y-1/2 z-10"
        >
          <div className="w-38 h-46 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg rotate-12 bg-white border-4 border-[#e3d0d0]">
            <img
              src="https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-clean-fresh-skin_186202-4848.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid"
              alt="Beauty client"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BeautyCTASection;
