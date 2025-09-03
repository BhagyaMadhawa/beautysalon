import React, { useState } from 'react';
import { Shield, MessageCircle, Clock, Star, CreditCard, Calendar } from 'lucide-react';
import img1 from '../../assets/trust/img1.png'
import img2 from '../../assets/trust/img2.png'
import img3 from '../../assets/trust/img3.png'
import img4 from '../../assets/trust/img4.png'
import img5 from '../../assets/trust/img5.png'
import cat_icon from '../../assets/category_icon.png';


const FeatureCard = ({ icon: Icon, title, description, image, isLarge = false, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
        isLarge ? 'col-span-2 h-80' : 'h-80'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 rounded-3xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0" />
        </div>
      )}
      
      {/* Background for non-image cards */}
      {!image && (
        <div className="absolute inset-0 bg-transparent " />
      )}

      {/* Content */}
      <div className="rounded-3xl border border-rosy-brown relative h-full p-8 flex flex-col justify-between">
        {/* Icon */}
        {!image && (
          <div className={`inline-flex p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 w-fit`}>
            <img
              src={cat_icon} 
              size={32} 
              className={`${image ? 'text-white' : 'text-rose-taupe'} transition-colors duration-300`}
            />
          </div>
        )}

        {/* Text Content */}
        <div className="space-y-3">
          <h3 className={`text-2xl font-bold transition-all duration-300 ${
            image ? 'text-white' : 'text-black'
          } group-hover:translate-x-2`}>
            {title}
          </h3>
          
          <p className={`text-lg leading-relaxed transition-all duration-300 ${
            image ? 'text-white/90' : 'text-rose-taupe/80'
          } group-hover:translate-x-2`}>
            {description}
          </p>
        </div>

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Animated Border */}
      <div className={`absolute inset-0 border-rosy-brown rounded-3xl transition-all duration-500 ${
        isHovered ? 'border-puce shadow-lg shadow-puce/20' : 'border-transparent'
      }`} />
    </div>
  );
};

const TrustFeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: Shield,
      title: "Verified Professionals",
      description: "Only The Best Salons & Independent Experts",
      image: null,
      isLarge: false,
      delay: 0
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "",
      description: "",
      image: img1,
      isLarge: false,
      delay: 100
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "Instant Chat",
      description: "Talk To Beauty Experts Before Booking",
      image: "",
      isLarge: false,
      delay: 100
    },
    {
      id: 4,
      icon: MessageCircle,
      title: "",
      description: "",
      image: img2,
      isLarge: false,
      delay: 100
    },
    {
      id: 5,
      icon: Clock,
      title: "Flexible Booking",
      description: "Choose A Time That Suits You",
      image: null,
      isLarge: false,
      delay: 200
    },
    {
      id: 6,
      icon: MessageCircle,
      title: "",
      description: "",
      image: img3,
      isLarge: false,
      delay: 100
    },
    {
      id: 7,
      icon: Star,
      title: "Portfolios & Reviews",
      description: "See Real Work Before Booking",
      image: null,
      isLarge: false,
      delay: 300
    },
    {
      id: 8,
      icon: MessageCircle,
      title: "",
      description: "",
      image: img4,
      isLarge: false,
      delay: 100
    },
    {
      id: 9,
      icon: CreditCard,
      title: "Secure Payments",
      description: "Pay Easily Through Our Platform",
      image: null,
      isLarge: false,
      delay: 400
    },
    {
      id: 10,
      icon: Calendar,
      title: "",
      description: "",
      image: img5,
      isLarge: false,
      delay: 500
    }
  ];

  return (
    <div className=" mx-auto max-w-[95%] px-6 py-4 ">
      {/* Header */}
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Why Thousands Trust Our
          <br />
          Beauty Marketplace
        </h2>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr">
        {features.map((feature, index) => {
          // Determine grid positioning for masonry-like layout
          let gridClass = "";
          if (feature.isLarge) {
            gridClass = "lg:col-span-2";
          }
          
          return (
            <div key={feature.id} className={`animate-fade-in ${gridClass}`}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                isLarge={feature.isLarge}
                delay={feature.delay}
              />
            </div>
          );
        })}
      </div>

      
      

      
    </div>
  );
};

export default TrustFeaturesSection;