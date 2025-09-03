import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
//testing dep

import growImg from '../../assets/grow.png';

const FeatureItem = ({ icon: Icon, title, description, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.6 }}
      className="flex items-start gap-4 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'scale-110 shadow-lg' : ''
        }`}
        style={{ backgroundColor: color }}
      >
        <CheckCircle size={16} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3
          className={`font-semibold text-gray-900 transition-all duration-300 ${
            isHovered ? 'text-rose-taupe translate-x-1' : ''
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-gray-600 text-sm leading-relaxed transition-all duration-300 ${
            isHovered ? 'text-gray-700 translate-x-1' : ''
          }`}
        >
          {description}
        </p>
      </div>

      {/* Arrow on Hover */}
      <div
        className={`transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      >
        <ArrowRight size={16} className="text-rose-taupe" />
      </div>
    </motion.div>
  );
};

const GrowBeautyBusiness = () => {
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  const features = [
    {
      id: 1,
      icon: User,
      title: 'Boost Your Profile',
      description: 'Get Featured And Attract More Clients',
      color: '#C37D92',
      delay: 0,
    },
    {
      id: 2,
      icon: Camera,
      title: 'Showcase Your Work',
      description: 'Upload Unlimited Portfolio Images & Videos',
      color: '#D89A9E',
      delay: 100,
    },
    {
      id: 3,
      icon: Calendar,
      title: 'Manage Your Appointments',
      description: 'Get Bookings Directly Through The Platform',
      color: '#AEB4A9',
      delay: 200,
    },
    {
      id: 4,
      icon: DollarSign,
      title: 'Earn More',
      description:
        'Join Thousands Of Beauty Professionals Growing Their Business Online',
      color: '#E0C1B3',
      delay: 300,
    },
  ];

  return (
    <div className="max-w-[95%] mx-auto px-6 py-16">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left Content Section */}
          
          <div className="p-8 lg:p-12 flex flex-col justify relative">

             <motion.svg
                    className="absolute left-[0%] top-[42%] mx-auto w-full h-full z-[0]"
                    viewBox="0 0 800 600"
                    preserveAspectRatio="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    >
                    <path
                        d="M0,300 C150,450 650,150 800,300 L800,600 L0,600 Z"
                        fill="#D291BC" 
                        fillOpacity="0.2"
                    />
                    </motion.svg>

            

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h2 className="text-4xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Grow Your Beauty
                <br />Business With Us
              </h2>
              <p className="text-gray-600 text-lg font-medium mb-8">
                FOR SALONS & INDEPENDENT ARTISTS:
              </p>
            </motion.div>

            
                   

            {/* Features */}
            <div className="space-y-6 mb-10 z-[1]">
              {features.map((feature) => (
                <FeatureItem key={feature.id} {...feature} />
              ))}
            </div>

            {/* CTA */}
            <motion.div
            className='z-[2]'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button
                className={`bg-gradient-to-r from-rosy-brown to-puce text-white px-8 py-4 rounded-xl z-[1] font-semibold text-lg transition-all duration-300 flex items-center gap-3 group ${
                  isCtaHovered ? 'z-[1] shadow-2xl shadow-puce/30 scale-105' : 'shadow-lg'
                }`}
                onMouseEnter={() => setIsCtaHovered(true)}
                onMouseLeave={() => setIsCtaHovered(false)}
              >
                Join as a Beauty Expert
                <ArrowRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    isCtaHovered ? 'translate-x-1' : ''
                  }`}
                />
              </button>
            </motion.div>
          </div>

          {/* Right Image Section */}
            <div className="relative bg-gradient-to-br from-pale-dogwood/30 via-rosy-brown/20 to-ash-grey/30 rounded-r-3xl overflow-visible">
            
            {/* Decorative Background Pattern */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-40px] right-[-40px] w-60 h-60 rounded-full bg-puce/20 blur-3xl" />
                <div className="absolute bottom-[-40px] right-[10%] w-48 h-48 rounded-full bg-rose-taupe/30 blur-2xl" />
                <div className="absolute top-1/2 left-[70%] w-40 h-40 rounded-full bg-rosy-brown/25 blur-xl" />
                <div className="absolute top-[10%] left-[50%] w-52 h-52 rounded-full bg-pale-dogwood/40 blur-2xl" />
            </div>

            <motion.div
                className="absolute  left-[-5%] w-[50%] top-[15%] h-[50%] rounded-full border-2 border-primary opacity-60 z-0 border-puce"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                />
               <motion.div
                className="absolute left-[-6%] top-[30%] w-[75%] h-[75%] rounded-full border-2 border-primary opacity-60 z-0 border-puce rotate-[10deg]"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 16 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                />
                



            {/* Main Image */}
            <div className="relative z-10 h-full">
                <motion.img 
                src={growImg}
                alt="Beauty professional applying makeup"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 rounded-l-3xl lg:rounded-l-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/5 to-black/10 z-20" />

            {/* Floating Element - Top */}
            <motion.div 
                className="absolute top-8 right-8 z-30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">Live Session</span>
                </div>
                </div>
            </motion.div>

            {/* Floating Element - Bottom */}
            <motion.div 
                className="absolute bottom-8 left-8 z-30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-puce to-rose-taupe rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                    </div>
                    <div>
                    <p className="text-xs text-gray-500">New Client</p>
                    <p className="text-sm font-semibold text-gray-700">+1 Booking</p>
                    </div>
                </div>
                </div>
            </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GrowBeautyBusiness;
