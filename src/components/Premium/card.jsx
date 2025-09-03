import React from 'react';
import { motion } from 'framer-motion';

const PremiumPlanCard = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="relative w-full mx-auto bg-gradient-to-br from-puce1-50 to-puce1-100 rounded-3xl shadow-xl overflow-hidden border border-gray-200 my-4 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle - Top Left */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full border-2 border-rose-300 opacity-30"
          variants={floatingVariants}
          animate="animate"
        />
        
        {/* Medium Circle - Top Right */}
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full border border-puce-200 opacity-25"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        
        {/* Small Circle - Bottom Left */}
        <motion.div
          className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-rose-100 to-puce1-100 opacity-40"
          variants={pulseVariants}
          animate="animate"
        />
        
        {/* Bottom Right Decorative Element */}
        <motion.div
          className="absolute -bottom-12 -right-12 w-36 h-36 sm:w-52 sm:h-52 md:w-72 md:h-72 rounded-full border-2 border-ash-grey-200 opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        
        {/* Additional Small Floating Elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-3 h-3 bg-puce rounded-full opacity-60"
          animate={{
            y: [0, -15, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-puce1-900 rounded-full opacity-50"
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-12 md:px-16 py-12 sm:py-16 md:py-20 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
          variants={itemVariants}
        >
          Unlock Exclusive Perks With
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-puce to-puce1-500">
            Our Premium Plan!
          </span>
        </motion.h1>
        
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Boost your beauty business with premium features designed for success
        </motion.p>
        
        {/* Call to Action Button */}
        <motion.div
          className="mt-8 sm:mt-10"
          variants={itemVariants}
        >
          
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PremiumPlanCard;
