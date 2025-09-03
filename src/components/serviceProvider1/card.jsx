import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, School,VenetianMask } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const Servicetype = () => {
  const [selectedType, setSelectedType] = useState("salon"); // Default to client

  const userTypes = [
    {
      id: "salon",
      title: "I own a salon with multiple services",
      icon: School,
    },
    {
      id: "individual",
      title: "I'm a Beauty Professional",
      icon: VenetianMask,
    },
  ];

  const handleSelection = (type) => {
    setSelectedType(type);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
            How would you like to join?
          </h1>
        </motion.div>

        {/* Selection Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={containerVariants}
        >
          {userTypes.map((type) => {
            const isSelected = selectedType === type.id;
            const IconComponent = type.icon;

            return (
              <motion.div
                key={type.id}
                className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-puce bg-puce1-50"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
                variants={cardVariants}
                whileHover={!isSelected ? "hover" : {}}
                whileTap="tap"
                onClick={() => handleSelection(type.id)}
                layout
              >
                {/* Selection Indicator */}
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-6 h-6 rounded-full bg-puce flex items-center justify-center">
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    isSelected ? "bg-puce1-100" : "bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent
                    className={`w-6 h-6 ${
                      isSelected ? "text-puce" : "text-gray-600"
                    }`}
                  />
                </motion.div>

                {/* Content */}
                <motion.div layout="position">
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-2 ${
                      isSelected ? "text-puce" : "text-gray-900"
                    }`}
                  >
                    {type.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-puce1-700" : "text-gray-600"
                    }`}
                  >
                    {type.description}
                  </p>
                </motion.div>

                {/* Animated Background */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl -z-10"
                    layoutId="selectedBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            className="w-full sm:w-auto bg-puce text-white font-semibold px-8 py-3 rounded-lg border hover:border-puce hover:bg-puce1-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log(`Creating account as: ${selectedType}`);
              // Handle account creation logic here
            }}
          >
            Continue
          </motion.button>

        
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Servicetype;