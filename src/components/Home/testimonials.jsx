import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden w-full min-h-[500px]"
    >
      <div className='grid lg:grid-cols-2 h-full'>
        {/* Content Section */}
        <div className="relative overflow-hidden h-full min-h-[300px] lg:min-h-[500px]">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="p-6 relative flex flex-col justify-center">
          {/* Quote Icon Overlay */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-rosy-brown bg-opacity-90 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-white fill-white " />
          </div>
          
          {/* Testimonial Text */}
          <p className="text-gray-700 text-base leading-relaxed mb-6 pr-16">
            {testimonial.text}
          </p>

          {/* Author Section */}
          <div className="flex items-center gap-3 mt-auto">
            <img
              src={testimonial.authorImage}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                {testimonial.name}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        
      </div>
    </motion.div>
  );
};

const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 lg:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 lg:mb-0 leading-tight"
        >
          Beauty That Speaks<br />For Itself
        </motion.h2>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4"
        >
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-rosy-brown to-puce flex items-center justify-center hover:from-rose-taupe hover:to-rose-taupe transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </div>

      {/* Testimonial Cards */}
      <div className="relative h-full">
        {/* Desktop View - Two cards side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={`left-${currentIndex}`}
              testimonial={testimonials[currentIndex]}
              isActive={true}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={`right-${currentIndex}`}
              testimonial={testimonials[(currentIndex + 1) % testimonials.length]}
              isActive={false}
            />
          </AnimatePresence>
        </div>

        {/* Mobile/Tablet View - Single card */}
        <div className="lg:hidden flex justify-center">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={`mobile-${currentIndex}`}
              testimonial={testimonials[currentIndex]}
              isActive={true}
            />
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-rosy-brown to-puce w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component
const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      text: "Ut enim ad minim veniam nostrud exercitation ullamco laboris ni aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt labore",
      name: "DARRELL STUWARD",
      image: "https://img.freepik.com/free-photo/beautiful-young-woman-with-clean-fresh-skin_186202-4956.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid",
      authorImage: "https://img.freepik.com/free-photo/close-up-portrait-young-beautiful-woman-with-perfect-clean-glowing-skin_186202-4771.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid"
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit voluptate velit.",
      name: "SARAH JOHNSON",
      image: "https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-white-flowers_186202-4602.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid",
      authorImage: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid"
    },
    {
      id: 3,
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
      name: "EMMA WATSON",
      image: "https://img.freepik.com/free-photo/portrait-beautiful-young-woman-with-clean-fresh-skin_186202-4848.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid",
      authorImage: "https://img.freepik.com/free-photo/close-up-portrait-young-beautiful-woman-with-perfect-clean-glowing-skin_186202-4773.jpg?ga=GA1.1.1981923502.1747204820&semt=ais_hybrid"
    }
  ];

  return <TestimonialCarousel testimonials={testimonials} />;
};

export default TestimonialSection;